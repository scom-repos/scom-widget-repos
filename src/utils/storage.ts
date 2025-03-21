import { getRootCid, getTransportEndpoint } from "../store/index";

const store = {
  packages: []
}

const getPackages = async () => {
  try {
    const response = await fetch(`${getTransportEndpoint()}/stat/${getRootCid()}`);
    const data = await response.json();
    let scomCid = '';
    let ijstechCid = '';
    for (const link of data?.links || []) {
      if (link.name === 'scom-repos') scomCid = link.cid;
      if (link.name === 'ijstech') ijstechCid = link.cid;
    }
    const promises = [];
    if (scomCid) promises.push(getFileContent(`${scomCid}`));
    if (ijstechCid) promises.push(getFileContent(`${ijstechCid}`));
    let [scom, ijstech] = await Promise.all(promises);
    if (scom) scom = JSON.parse(scom);
    if (ijstech) ijstech = JSON.parse(ijstech);

    const scomLinks = (scom?.links || []).map(link => ({...link, name: `@scom/${link.name}`}));
    const ijstechLinks = (ijstech?.links || []).map(link => ({...link, name: `@ijstech/${link.name}`}));

    store.packages = [
      ...scomLinks,
      ...ijstechLinks
    ];
  } catch (error) {
    console.error(error);
    store.packages = [];
  }
}

const getPackageCid = (name: string) => {
  const finded = store.packages.find(item => item.name === name);
  return finded?.cid;
}

const getPackageScript = async (name: string) => {
  try {
    const cid = getPackageCid(name);
    if (!cid) throw new Error('Cannot fetch package info ' + name);
    const packageJson = await getFileContent(`${cid}/package.json`);
    const packageJsonObj = packageJson ? JSON.parse(packageJson) : {};
    let mainDir = packageJsonObj.plugin || packageJsonObj.browser || packageJsonObj.main;
    if (mainDir.startsWith('./')) mainDir = mainDir.slice(2);
    if (mainDir.startsWith('/')) mainDir = mainDir.slice(1);
    const mainContent = await getFileContent(`${cid}/${mainDir}`);
    const dependencies = packageJsonObj?.dependencies || {};

    return {
      module: name,
      dependencies,
      script: mainContent
    }
  } catch(err) {
    console.error(err);
  }

  return {
    module: name,
    script: '',
    dependencies: {}
  };
}

const getPackage = async (name: string) => {
  try {
    const { script, dependencies = {} } = await getPackageScript(name);
    const dependPromises = [];

    for (const key in dependencies) {
      dependPromises.push(getPackageScript(key));
    }
    const dependScripts = await Promise.all(dependPromises) || [];

    return {
      dependencies: dependScripts,
      script
    };
  } catch {}

  return {
    script: '',
    dependencies: []
  };
}

const getScconfig = async (name: string) => {
  try {
    const cid = getPackageCid(name);
    if (!cid) return;
    const scconfigJson = await getFileContent(`${cid}/scconfig.json`);
    return scconfigJson;
  } catch {}

  return null;
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
  getPackage,
  getScconfig
};