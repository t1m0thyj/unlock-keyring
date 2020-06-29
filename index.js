const core = require("@actions/core");
const exec = require("@actions/exec");

try {
  await exec.exec("sudo apt-get install -qq -y dbus-x11 gnome-keyring");
  await exec.exec("eval $(dbus-launch --sh-syntax)");
  await exec.exec("echo 'root' | /usr/bin/gnome-keyring-daemon -r -d --unlock");
} catch (error) {
  core.setFailed(error.message);
}
