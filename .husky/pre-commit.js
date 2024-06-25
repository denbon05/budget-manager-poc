#!/usr/bin/env node
// @ts-check
import { execSync } from 'child_process';

const checkVaultEncrypted = () => {
  const arg = process.argv[2];
  console.warn('Going to check decrypted files, one sec 👀');
  const vaultFiles = execSync(`find ${arg ?? 'ansible'} -name "*vault.y*ml"`)
    .toString()
    .split('\n')
    .filter(Boolean);

  const encryptedPattern = /\$ANSIBLE_VAULT;/;
  const decryptedFiles = [];
  for (const vaultFile of vaultFiles) {
    const output = execSync(`head -n 1 ${vaultFile}`).toString();
    const isFileDecrypted = !encryptedPattern.test(output);
    const isFileEmpty = output.trim() === '';

    if (isFileDecrypted && !isFileEmpty) {
      decryptedFiles.push(vaultFile);
    }
  }

  if (decryptedFiles.length) {
    console.error(
      `Forgot to encrypt something 💀?\n${decryptedFiles.join('\n')}`,
    );
    process.exit(1);
  }
};

checkVaultEncrypted();

console.info('Everything seems cool 🤙');
process.exit(0);
