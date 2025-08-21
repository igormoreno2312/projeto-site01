# 👕 2R Camisetas - E-commerce

 <!-- Substitua pelo link de uma imagem do seu projeto -->

Projeto de um site de e-commerce simples e moderno para uma loja de camisetas, desenvolvido com as tecnologias fundamentais da web: HTML, CSS e JavaScript puro (vanilla). O objetivo foi criar uma experiência de compra funcional e agradável, demonstrando habilidades em desenvolvimento front-end.

---

## ✨ Funcionalidades Principais

- **Navegação Intuitiva:** Páginas de listagem de produtos separadas por categorias (masculino e feminino).
- **Detalhes do Produto:** Página dedicada para cada produto, acessível a partir da listagem.
- **Carrinho de Compras Dinâmico:**
  - Adição, remoção e ajuste de quantidade de itens.
  - Os dados do carrinho são salvos no `localStorage` do navegador, persistindo entre as sessões.
- **Cálculo de Frete Interativo:**
  - Integração com a API **ViaCEP** para buscar o endereço do usuário.
  - Simulação de custos de frete com base na localidade.
- **Carrossel de Imagens:** Componente interativo na página inicial com navegação e autoplay.
- **Modais Modernos:**
  - Modal de login com animações suaves.
  - Fluxo completo para recuperação de senha ("Esqueci minha senha").
- **Notificações "Toast":** Feedback visual para o usuário (ex: "Produto adicionado!"), sem o uso de alertas bloqueantes.
- **Design Responsivo:** O layout se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído do zero, sem o uso de frameworks ou bibliotecas externas de grande porte, para focar nos fundamentos.

- **HTML5:** Estruturação semântica do conteúdo.
- **CSS3:** Estilização completa, utilizando recursos modernos como:
  - **Flexbox** e **Grid Layout** para layouts complexos.
  - **Variáveis CSS (Custom Properties)** para um tema consistente e fácil de manter.
  - **Animações e Transições** para uma experiência de usuário mais fluida.
- **JavaScript (ES6+):**
  - Manipulação do DOM para todas as interatividades.
  - Lógica de negócio do carrinho de compras.
  - Comunicação com APIs externas (`fetch`).
  - Gerenciamento de estado local com `localStorage`.

---

## ⚙️ Como Executar o Projeto

Por ser um projeto puramente front-end, não há necessidade de um processo de build complexo.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/IGORMORENO2312/PROJETO-SITE01.git
   ```
2. **Navegue até a pasta do projeto:**
   ```bash
   cd PROJETO-SITE01
   ```
3. **Abra o arquivo `index.html` no seu navegador de preferência.**

   > **Dica:** Para uma melhor experiência de desenvolvimento, recomenda-se usar a extensão **Live Server** no Visual Studio Code, que cria um servidor local e atualiza a página automaticamente após cada alteração.
