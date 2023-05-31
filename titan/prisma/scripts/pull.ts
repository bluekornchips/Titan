/**
 * The Prisma pull command.
 * @param client 
 * @returns The command, with schema path.
 */
const pull = (client: string, projectPath: string): string => {
    const command_pull = `npx prisma db pull --schema=.${projectPath}${client}.prisma`;
    return command_pull;
}

export default pull;