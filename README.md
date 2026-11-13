# Pomodoro Web (frontend-only)

Timer Pomodoro em HTML, CSS e JavaScript puro, sem backend.

## Regras

- Foco: 25 min (padrão)
- Pausa curta: 5 min
- Pausa longa: 15 min
- 4 focos por ciclo; a pausa longa vem após o 4º foco.
- Cada etapa começa parada: clique em "Iniciar" para começar.
- "Reiniciar" restaura a etapa atual e preserva os focos concluídos.

## Como rodar

Abra `index.html` no navegador (ou use uma extensão de servidor local).

## Modo de teste

Acesse `index.html?teste=1` ou acesse `https://web-pomodoro-nu.vercel.app/?teste=1`. Nesse modo as durações ficam em segundos
(foco 10 s, pausa curta 5 s, pausa longa 8 s), permitindo percorrer
um ciclo completo em menos de 1 minuto.

## Armazenamento

Não há persistência. Recarregar a página volta ao estado inicial.
