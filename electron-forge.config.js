module.exports = {
  packagerConfig: {
    icon: "./build/icon", // icon path
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "Codability",
        authors: "Milan Haria",
        exe: "Codability.exe",
        setupExe: "Codability-Setup.exe",
        noMsi: false,
        setupIcon: "./build/icon.ico", // windows icon path
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "win32"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};
