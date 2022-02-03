# Rolling Alertbox overlay

This example overlay creates an overlay with a single alerbox with a number of variations.

The yaml file uses inheritance to reduce clutter and make it easy to update multiple alerts in one go.

It uses the various `alertbox.{css,html,js,fields.json}` files to upload to StreamElements in their respective places. The `alertbox_browser.html` file is for local development of the same and contains some extra boilerplate code.

The overlay uses fields to show different information for different events while keeping the code (html/css/js) the same for all. To enable using the css and js files as-is for both local development and in production use, the html files set some variables that are either received from streamelements (who do string replacement, like replacing `{name}` with the relevant username) or hardcoded for the browser version.

## Usage

To try this overlay, set up `seupload` with your channel ID and JWT key (see main readme), create a new overlay in the dashboard and copy its id (found in the URL). Then, run:

`seupload put overlay.yml --id overlayidhere`

Or edit the yml file to include the id and run:

`seupload put overlay.yml`

**Important**: Uploading an overlay **replaces** what was there; make sure you create a *new* overlay so you don't overwrite anything important.
