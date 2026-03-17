import { setPath } from "../navigation.js";

export async function hashCompare(currentPath, args) {
  try {
    console.log(args[args.indexOf("--input") + 1],args[args.indexOf("--hash")+1] )
    const inputFile=await setPath(currentPath,args[args.indexOf("--input") + 1])
    const hashFile= await setPath(currentPath,args[args.indexOf("--hash")+1])

    
  } catch (e) {
    console.error(e.message);
  }
  console.log('Operation field')
  console.log(args);
}
