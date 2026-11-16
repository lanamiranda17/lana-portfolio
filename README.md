# Lana Miranda — Portfólio

Portfólio profissional de **Lana Miranda**, estudante de Ciência da Computação na Universidade Federal de Lavras (UFLA), com foco em **Engenharia de Software, Inteligência Artificial e Pesquisa Operacional**.

🔗 **Publicado em:** https://lanamiranda17.github.io/lana-portfolio/

O endereço raiz abre diretamente a versão profissional, em [`portfolio/`](portfolio/).

## Histórico do projeto

O projeto foi criado inicialmente como trabalho de uma disciplina, com o objetivo de comparar frameworks CSS: a mesma página foi desenvolvida em duas versões, uma com **Bootstrap** e outra com **Tailwind CSS**.

Posteriormente, com o apoio de ferramentas de inteligência artificial, ele foi adaptado para uso como portfólio profissional, com nova identidade visual, conteúdo atualizado e implementação em HTML, CSS e JavaScript puros. As versões originais da disciplina foram preservadas no repositório.

## Conteúdo

- Apresentação, formação e áreas de atuação
- Experiências: FutureLab / UFMG, GEDAI / UFLA e Comp Júnior
- Projetos em destaque (Multi-Agent Study Assistant, Student Class Allocation Optimizer, Terroir E-commerce, CARP Routing Heuristics), projetos em desenvolvimento e outros trabalhos, com créditos às equipes
- Pesquisa em otimização do agendamento cirúrgico e competências técnicas
- Contato: e-mail, GitHub e LinkedIn

## Tecnologias

- HTML5 semântico, CSS3 e JavaScript puro, sem frameworks nem etapa de build
- Canvas 2D para o grafo animado do hero (caminho mínimo calculado com Dijkstra)
- Google Fonts: Instrument Serif, Inter Tight e JetBrains Mono

Inclui layout responsivo, navegação por teclado, link para pular ao conteúdo, suporte a `prefers-reduced-motion` e animações pausadas quando o hero sai da tela.

## Estrutura

```text
index.html          Redireciona para portfolio/
portfolio/          Versão profissional
  index.html
  css/style.css
  js/main.js
  assets/img/
assets/             Recursos compartilhados (foto)
bootstrap/          Versão acadêmica com Bootstrap
tailwind/           Versão acadêmica com Tailwind CSS
```

## Executar localmente

Como o site é estático, basta servir a pasta do repositório:

```bash
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000/`.

## Versões acadêmicas

As duas versões desenvolvidas para a disciplina foram preservadas e continuam acessíveis:

- Bootstrap: https://lanamiranda17.github.io/lana-portfolio/bootstrap/
- Tailwind CSS: https://lanamiranda17.github.io/lana-portfolio/tailwind/

## Licença

Este projeto está sob a licença MIT.
