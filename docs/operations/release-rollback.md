# Rollback de release

Este procedimento volta o código da aplicação para uma release anterior sem restaurar MySQL nem apagar uploads. Uma regressão de interface ou código não é motivo para sobrescrever conteúdo editorial mais recente.

Antes de publicar uma release, registre o caminho absoluto da release atual e mantenha seu diretório intacto. Para voltar, valide que a release alvo está dentro de /opt/endcontrol/releases e contém um build Next completo:

    PREVIOUS_RELEASE=/opt/endcontrol/releases/substitua-pelo-commit-anterior
    test -d "$PREVIOUS_RELEASE"
    test -f "$PREVIOUS_RELEASE/package.json"
    test -d "$PREVIOUS_RELEASE/.next"
    case "$(realpath -e "$PREVIOUS_RELEASE")" in
      /opt/endcontrol/releases/*) ;;
      *) echo "Release fora do diretório permitido" >&2; exit 1 ;;
    esac

Atualize o link ativo por rename no mesmo filesystem, reinicie o serviço e valide a aplicação local antes de avaliar qualquer etapa pública:

    sudo ln -s "$PREVIOUS_RELEASE" /opt/endcontrol/current.rollback
    sudo mv -Tf /opt/endcontrol/current.rollback /opt/endcontrol/current
    sudo systemctl restart endcontrol.service
    sudo systemctl status --no-pager endcontrol.service
    curl --fail --silent --show-error http://127.0.0.1:3000/
    curl --fail --silent --show-error http://127.0.0.1:3000/api/health

Se o serviço não iniciar, consulte journalctl -u endcontrol.service e mantenha o site público atual no GitHub Pages. Não altere DNS como parte de um rollback local.

As migrations devem ser compatíveis com a versão ativa anterior. Não aplique um down migration automático. Se a mudança de schema for incompatível ou se houver perda/corrupção de dados, pare a publicação, faça um backup do estado atual e siga o procedimento explícito de [restauração](backup-restore.md) com confirmação do banco. A restauração perde alterações posteriores ao snapshot escolhido.
