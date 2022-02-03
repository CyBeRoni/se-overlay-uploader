# StreamElements Overlay Uploader

This progam lets you upload (and download) overlays to and from StreamElements, such that you are able to develop them locally and upload the result instead of using the SE web editor and going mad.

It allows the use of YAML, which in turn allows you to use inheritance to reduce duplication. An extension to YAML is provided to load a file into a string.

Note that the overlay JSON format used by StreamElements is entirely undocumented and not guaranteed to be stable. It's best to use an overlay JSON downloaded from StreamElements as a starting point. Unused keys can for the most part be omitted but doing so may break the overlay if the StreamElements code does not check for unset values.

## Usage
### Installation
Simply run:

`npm -g install`

After this a command `seupload` will be available.

### Set-up
Environment variables are used for authentication data. These can either be in the actual environment or loaded from a .env file.

Supported (and required) variables are:
 - SE_API_URL: Generally this should be set to "https://api.streamelements.com/kappa/v2/"
 - SE_ACCOUNT_ID: Your account ID
 - SE_ACCOUNT_JWT Your account JWT token

These variables must be set before anything else can be done.

### Downloading an overlay
An existing overlay can be downloaded in JSON form by using the `get` command. The command outputs to stdout:

`seupload get <overlayid> > overlay.json`

### Converting an overlay JSON to YAML
A JSON file can be converted to YAML using the `toyaml` command. It also outputs to stdout:

`seupload toyaml overlay.json > overlay.yml`

This YAML can then be edited to your satisfaction.

### Converting an overlay YAML to JSON
Conversely, a YAML file can be converted to JSON:

`seupload tojson overlay.yml > overlay.json`

Generally it is not necessary to do this manually; it is done automatically before uploading.

### Uploading an overlay to StreamElements
The `put` command is used to upload yaml (or JSON) files to StreamElements:

`seupload put overlay.yml`

It will get the Overlay ID from the yaml file by default, but if needed this can be overridden. In that case you may also want to override the overlay name:

`seupload put --id someid --name "Overlay backup" overlay.yml`

If your input file is already JSON, for example because you were creating a backup or use a tool that outputs JSON, the conversion from YAML can be disabled:

`seupload put --json overlay.json`


## YAML contents
The StreamElements overlay JSON contains a large number of fields that may be duplicated many times, for example in the case of AlertBox variations. To help with this you can use YAML's inheritance operators. Upon conversion to JSON, any keys starting with `.` are ignored. For example, the following input:

```
.base: &base
  sub: foo
  sub2: bar

stuff:
  <<: *base
  sub: moof
```

Will result in the following JSON output:
```
{
  "stuff": {
    "sub": "moof",
    "sub2": "bar"
  }
}
```

Files can be included as a string, too, using an extension to yaml:

```
.alertbox-custom-html: &customhtml
  css: !!file alertbox.css
  html: !!file alertbox.html
  js: !!file alertbox.js
  fields: !!file alertbox.fields.json
```

See the examples directory for examples of how to these features.
