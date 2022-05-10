const core = require("@actions/core");
const exec = require("@actions/exec");

if (process.platform !== "linux" || process.env.DISPLAY != null) {
  core.error("This action only supports headless Linux systems");
  process.exit();
}

async function execBashCmdAndExportVars(command) {
  const cmdOutput = await exec.getExecOutput("bash", ["-c", command]);
  for (const line of cmdOutput.stdout.split("\n")) {
    const match = line.match(/^(\w+)='?(.+?)'?;?$/);
    if (match) core.exportVariable(match[1], match[2]);
  }
}

(async () => {
  const aptGet = process.getuid() === 0 ? "apt-get" : "sudo apt-get";
  try {
    await exec.exec(`${aptGet} install -qq dbus-x11 gnome-keyring`);
  } catch {
    await exec.exec(`${aptGet} update -qq`);
    await exec.exec(`${aptGet} install -qq dbus-x11 gnome-keyring`);
  }
  await execBashCmdAndExportVars("dbus-launch --sh-syntax");
  await execBashCmdAndExportVars("echo '' | /usr/bin/gnome-keyring-daemon --unlock");
})().catch(core.setFailed);
