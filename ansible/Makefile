# vault
vault_cmd = find . -name "*vault.y*ml" -type f -exec ansible-vault $(cmd) {} \;

vault-encrypt:
	$(eval cmd := encrypt)
	$(vault_cmd)

vault-decrypt:
	$(eval cmd := decrypt)
	$(vault_cmd)
