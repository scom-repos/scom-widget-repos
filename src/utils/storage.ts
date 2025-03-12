import { getScomCid, getTransportEndpoint } from "../store/index";

const store = {
  packages: []
}

const getPackages = async () => {
  try {
    const response = await fetch(`${getTransportEndpoint()}/stat/${getScomCid()}`);
    const data = await response.json();
    store.packages = data?.links || [];
  } catch (error) {
    console.error(error);
    store.packages = [];
  }
}

const getPackageCid = (name: string) => {
  const finded = store.packages.find(item => item.name === name);
  return finded?.cid;
}

const getPackage = async (name: string) => {
  try {
    const cid = getPackageCid(name);
    if (!cid) return;
    const packageJson = await getFileContent(`${cid}/package.json`);
    const packageJsonObj = packageJson ? JSON.parse(packageJson) : {};
    let mainDir = packageJsonObj.plugin || packageJsonObj.browser || packageJsonObj.main;
    if (mainDir.startsWith('./')) mainDir = mainDir.slice(2);
    if (mainDir.startsWith('/')) mainDir = mainDir.slice(1);
    const mainContent = await getFileContent(`${cid}/${mainDir}`);
    return mainContent;
  } catch {}

  return '';
}

const getFileContent = async (path: string) => {
  try {
    if (path.startsWith('/')) path = path.slice(1);
    const uri = `${getTransportEndpoint()}/ipfs/${path}`;
    const response = await fetch(uri);
    if (response.ok) return await response.text();
  } catch (error) {}
  return '';
}

export {
  getPackages,
  getPackage
};