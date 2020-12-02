const core = require("@actions/core");
const exec = require("@actions/exec");

async function execBashCmdAndExportVars(command) {
  let capturedOutput = "";
  const options = {
    listeners: {
      stdout: (data) => {
        capturedOutput += data.toString();
      }
    }
  };
  await exec.exec("bash", ["-c", command], options);
  for (const line of capturedOutput.split("\n")) {
    const match = line.match(/^(\w+)='?(.+?)'?;?$/);
    if (match) core.exportVariable(match[1], match[2]);
  }
}

(async () => {
  await exec.exec("sudo apt-get install -qq dbus-x11 gnome-keyring");
  await execBashCmdAndExportVars("dbus-launch --sh-syntax");
  await execBashCmdAndExportVars("echo 'root' | /usr/bin/gnome-keyring-daemon -r -d --unlock");
})().catch((error) => {
  core.setFailed(error.message);
});
