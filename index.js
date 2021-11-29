const core = require("@actions/core");
const exec = require("@actions/exec");

async function execBashCmdAndExportVars(command) {
  const cmdOutput = await exec.getExecOutput("bash", ["-c", command]);
  for (const line of cmdOutput.stdout.split("\n")) {
    const match = line.match(/^(\w+)='?(.+?)'?;?$/);
    if (match) core.exportVariable(match[1], match[2]);
  }
}

(async () => {
  await exec.exec("sudo apt-get install -qq dbus-x11 gnome-keyring");
  await execBashCmdAndExportVars("dbus-launch --sh-syntax");
  await execBashCmdAndExportVars("echo 'root' | /usr/bin/gnome-keyring-daemon -r -d --unlock");
})().catch(core.setFailed);
