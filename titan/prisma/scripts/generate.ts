/**
 * The Prisma generate command.
 * @param client 
 * @returns The command, with schema path.
 */
const generate = (client: string, projectPath: string): string => {
    const command_generate = `npx prisma generate --schema=.${projectPath}${client}.prisma`;
    return command_generate;
}

export default generate;