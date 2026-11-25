# Validação local das operações

Verificação feita em 14/11/2026 no Windows de desenvolvimento. Nenhum acesso remoto, deploy ou alteração de DNS foi executado, e o ensaio não gravou no banco de origem.

## Ensaio MySQL e uploads

- Ferramentas usadas: Node.js 22.23.4, MySQL local Laragon 8.4.3 e `tar.exe` do Windows.
- O snapshot temporário foi criado do banco local após pausar outras gravações e tem SHA-256 `119295d7ffe912ef625886cd394585879c134647eeac5fc14b3bf6e7ad193f4e`.
- O banco de origem tinha 11 tabelas e 391 linhas contadas antes do dump e continuava com 11 tabelas e 391 linhas depois do ensaio.
- O dump foi importado para um schema descartável. Após conferir as contagens, o schema recebeu uma tabela marcador e foi removido e recriado somente dentro do ensaio; uma nova importação restaurou as 11 tabelas e 391 linhas. As contagens do schema restaurado coincidiram com as da origem.
- Como a pasta local de uploads estava vazia, o ensaio criou um arquivo `.webp` sintético UUID somente em uma pasta temporária, empacotou-o junto ao SQL, alterou e removeu o arquivo temporário e então extraiu o arquivo. SHA-256 antes e depois: `3b656c86ff3687f0220bbb7d3a182e8b5718a1cf34a5ebe603153427c4be4bdf`.
- O schema descartável e o pacote temporário foram removidos ao final. O dump fresco temporário foi removido depois de registrar o hash e as contagens.

Um snapshot QA anterior foi capturado antes de parte do estado CMS atual e continha 9 tabelas e 36 linhas. Ele não foi usado para o resultado aprovado. O dump fresco acima foi capturado após a pausa de gravações; origem, primeira importação e restauração ficaram estáveis em 11 tabelas e 391 linhas.

## Scripts versionados

- `backup.sh`, `restore.sh` e `_common.sh` passaram pela análise de sintaxe com Bash para Windows.
- `backup.sh --help` e `restore.sh --help` foram executados localmente.
- Os scripts operacionais exigem Linux, GNU coreutils/tar, `flock`, MySQL e systemd. Eles **não** foram executados em runtime Linux; portanto, parada de unidade systemd, permissões Unix, backup executado pelo script e recuperação automática em falha ainda precisam do ensaio de aceitação em uma preparação Linux.
- O ensaio Windows confirmou dump/import do MySQL e round-trip do arquivo sintético, mas não executou os próprios scripts `backup.sh`/`restore.sh`.

O teste de aceitação do futuro host permanece pendente. Antes de qualquer corte, repetir o roteiro Linux de [backup e restauração](backup-restore.md) em um schema e diretório de mídia descartáveis. As contagens registradas aqui são agregadas; nenhum registro pessoal, credencial ou conteúdo do dump foi incluído neste relatório.
