# ElectronTsNgQuickStart

Projeto electron vazio utilizando angular no renderer process e typescript no main process


## Stack

| Tecnologia  | Versão      |
| ----------- | ----------- |
| Typescript  | 5.8.2       |
| Angular     | 20.1.3      |
| Node        | 22.14.0     |
| Electron    | 37.2.4      |

## Servidor local
Para iniciar a aplicação localmente, rode:

```bash
npm run start:electron
```

## Gerar executável

Para gerar o arquivo executável e suas dependências(para windows), rode o comando:

**Obs:** substitua o nome ``electronAppStart`` pelo nome desejado para sua aplicação no script ``pkg`` no arquivo ``package.json``.


## Estrutura

Na pasta src-main encontram-se os arquivos typescript que rodaram no processo principal (main process).

Já, na pasta src-renderer encontram-se os arquivos angular que rodaram no processo de renderização (renderer process).

## TO-DO
- implementar injeção de dependência com ts-ring no source do main process
- garantir que o rebuild aconteça caso arquivos sejam alterados tanto no renderer quanto no main process quando rodar o servidor local(start:electron)