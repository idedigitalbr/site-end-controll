# Contribuição

## Regra obrigatória de sincronização

Antes de qualquer `push`, sincronize a branch local com o repositório remoto para evitar divergências:

```powershell
git pull --rebase origin <branch-atual>
git push origin <branch-atual>
```

Se o `pull --rebase` encontrar conflitos, resolva-os e valide o projeto antes de continuar. Não use `push --force` como forma de resolver divergências.

Após alterações de código, execute a suíte de testes e o script de integridade do site antes do `push`.
