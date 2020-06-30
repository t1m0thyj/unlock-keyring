const core = require("@actions/core");
const exec = require("@actions/exec");

(async () => {
  let capturedOutput;
  const options = {
    listeners: {
      stdout: (data) => {
        capturedOutput += data.toString();
      }
    }
  }
  await exec.exec("sudo apt-get install -qq -y dbus-x11 gnome-keyring");
  capturedOutput = "";
  await exec.exec("bash", ["-c", "dbus-launch --sh-syntax"], options);
  for (const line of capturedOutput.split("\n")) {
    const match = line.match(/(\w+)='?(.+?)'?;/)
    if (!match) continue;
    core.info(`${match[1]}=${match[2]}`);
    core.exportVariable(match[1], match[2]);
  }
  capturedOutput = "";
  await exec.exec("bash", ["-c", "echo 'root' | /usr/bin/gnome-keyring-daemon -r -d --unlock"], options);
  for (const line of capturedOutput.split("\n")) {
    const match = line.match(/(\w+)=(.+?)/);
    if (!match) continue;
    core.info(`${match[1]}=${match[2]}`);
    core.exportVariable(match[1], match[2]);
  }
})().catch((error) => {
  core.setFailed(error.message);
});
