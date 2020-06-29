const core = require("@actions/core");
const exec = require("@actions/exec");

(async () => {
  await exec.exec("sudo apt-get install -qq -y dbus-x11 gnome-keyring");
  await exec.exec("bash", ["-c", "eval $(dbus-launch --sh-syntax)"]);
  await exec.exec("bash", ["-c", "echo 'root' | /usr/bin/gnome-keyring-daemon -r -d --unlock"]);
  core.info(process.env.DBUS_SESSION_BUS_ADDRESS);
  core.exportVariable("DBUS_SESSION_BUS_ADDRESS", process.env.DBUS_SESSION_BUS_ADDRESS);
})().catch((error) => {
  core.setFailed(error.message);
});
