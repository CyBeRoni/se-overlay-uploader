#! /usr/bin/env node

'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const yargs = require('yargs');

require('dotenv').config();

const axios = require('axios').create({
    baseURL: process.env.SE_API_URL,
    timeout: 10000,
    headers: {
        'Authorization': "Bearer " + process.env.SE_ACCOUNT_JWT
    }
});

function readJSON(file){
    const data = fs.readFileSync(file);
    return JSON.parse(data);
}

// Output JSON but remove any keys that start with '.'
function overlayToJSON(data){
    function replacer (key, value) { return key.startsWith('.') ? undefined : value; };
    return JSON.stringify(data, replacer);
}

function readYaml(file){
    const data = fs.readFileSync(file);
    const fileTag = new yaml.Type('tag:yaml.org,2002:file', {
        kind: 'scalar',
        construct: data => {
            return fs.readFileSync(data).toString();
        }
    })
    const schema = yaml.DEFAULT_SCHEMA.extend([fileTag])
    return yaml.load(data, {schema: schema});
}

function getJSONFromStreamElements(accountid, overlayid){
    const data = axios.get(`overlays/${accountid}/${overlayid}`,
      {
        transformResponse: [] // We want the string this time so don't parse the JSON
      }
    ).then((data) => {
        return data.data;
    });

    return data;
}

function putJSONToStreamElements(accountid, overlayid, data){
    const resp = axios.put(`overlays/${accountid}/${overlayid}`, data,
    {
        headers: {
            "Content-Type": "application/json"
        },
        transformRequest: [function (data, headers){
            return overlayToJSON(data);
        }],
    }).then((resp) => {
        return resp;
    });

    return resp;
}

function cmd_get (argv) {
    const data = getJSONFromStreamElements(process.env.SE_ACCOUNT_ID, argv.id).then((data) => {
        process.stdout.write(data);
    }).catch((e) => {
        console.error("Failed to get JSON from StreamElements\n");
        console.error(e.toString());
    });
}

function cmd_put (argv) {
    let data;
    let id;

    if (argv.json){
        data = readJSON(argv.file);
    } else {
        data = readYaml(argv.file);
    }

    if (argv.id){
        id = argv.id;
        data._id = argv.id;
    } else {
        id = data._id;
    }

    if (argv.name){
        data.name = argv.name;
    }

    console.log(`Uploading "${data.name}" from ${argv.file} to id ${id}`);

    const resp = putJSONToStreamElements(process.env.SE_ACCOUNT_ID, id, data).then((resp) => {
        if (resp.status === 200){
            console.log("Success!")
        }
    }).catch((e) => {
        console.error("Failed to upload overlay to StreamElements\n");
        console.error(e.toString());
    });
}

function cmd_toyaml (argv) {
    process.stdout.write(yaml.dump(readJSON(argv.file)));
}

function cmd_tojson (argv) {
    const data = readYaml(argv.file)
    process.stdout.write(overlayToJSON(data));
}

const argv = yargs
  .command('get [id]', 'Get an overlay by ID', (yargs) => {
    yargs.positional('id', {
      type: 'string',
      describe: 'Overlay ID'
    })
  }, cmd_get)
  .command('put [file]', 'Upload overlay from a file', (yargs) => {
    yargs.positional('file', {
        type: 'string',
        describe: "Input filename"
    })
    .option('id', {
        type: 'string',
        describe: 'Override Overlay ID (default: from file)'
    })
    .option('json', {
        type: 'boolean',
        describe: "Input file is already JSON (default: YAML)"
    })
    .option('name', {
        type: 'string',
        describe: "Override Overlay Name"
    })
  }, cmd_put)
  .command('toyaml [file]', 'Convert JSON to YAML', (yargs) => {
    yargs.positional('file', {
      type: 'string',
      describe: 'JSON file'
    })
  }, cmd_toyaml)
  .command('tojson [file]', 'Convert YAML to JSON', (yargs) => {
    yargs.positional('file', {
      type: 'string',
      describe: 'YAML file'
    })
  }, cmd_tojson)
  .help()
  .alias('help', 'h').argv;

