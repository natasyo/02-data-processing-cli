export async function count(currentPath, args) {
    if (args.length !== 2)
        throw new Error(
            'Error: count command argument format: --input file.txt'
        );

console.log(currentPath, args);
}