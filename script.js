let consumos = JSON.parse(localStorage.getItem("consumos")) || [];
let indiceEditando = -1;
let indiceExcluindo = -1;

const splash = document.querySelector("#splash");
const home = document.querySelector("#home");
const temaEscuro = document.querySelector("#temaEscuro");
const btnEntrar = document.querySelector("#btnEntrar");
const btnVoltar = document.querySelector("#btnVoltar");
const btnAdicionar = document.querySelector("#btnAdicionar");

const modalCadastro = document.querySelector("#modalCadastro");
const modalExcluir = document.querySelector("#modalExcluir");
const formConsumo = document.querySelector("#formConsumo");
const tituloModal = document.querySelector("#tituloModal");
const quantidade = document.querySelector("#quantidade");
const peso = document.querySelector("#peso");
const btnSalvar = document.querySelector("#btnSalvar");

const btnFecharCadastro = document.querySelector("#btnFecharCadastro");
const btnCancelarExclusao = document.querySelector("#btnCancelarExclusao");
const btnConfirmarExclusao = document.querySelector("#btnConfirmarExclusao");

const listaConsumos = document.querySelector("#listaConsumos");
const totalHoje = document.querySelector("#totalHoje");
const porcentagemMeta = document.querySelector("#porcentagemMeta");

function salvarDados() {
    localStorage.setItem("consumos", JSON.stringify(consumos));
}

function abrirHome() {
    splash.classList.add("escondido");
    home.classList.remove("escondido");
    atualizarTela();
}

function abrirSplash() {
    home.classList.add("escondido");
    splash.classList.remove("escondido");
}

function formatarData(data) {
    const partes = data.split(" ");

    if (partes.length < 2) {
        return data;
    }

    const dataPartes = partes[0].split("-");

    if (dataPartes.length !== 3) {
        return data;
    }

    return `${dataPartes[2]}/${dataPartes[1]}/${dataPartes[0]} ${partes[1]}`;
}

function obterDataAtual() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    const hora = String(agora.getHours()).padStart(2, "0");
    const minuto = String(agora.getMinutes()).padStart(2, "0");

    return `${ano}-${mes}-${dia} ${hora}:${minuto}`;
}

function totalDoDia() {
    const hoje = obterDataAtual().substring(0, 10);

    return consumos
        .filter((consumo) => consumo.data.substring(0, 10) === hoje)
        .reduce((total, consumo) => total + Number(consumo.quantidadeEmMl), 0);
}

function metaDiaria() {
    if (consumos.length === 0) {
        return 0;
    }

    return Number(consumos[consumos.length - 1].pesoAtualKg) * 35;
}

function calcularPorcentagem() {
    const meta = metaDiaria();

    if (meta === 0) {
        return 0;
    }

    return (totalDoDia() / meta) * 100;
}

function atualizarResumo() {
    totalHoje.textContent = `${totalDoDia().toFixed(0)} ml`;
    porcentagemMeta.textContent = `${calcularPorcentagem().toFixed(1)}% da meta diária`;
}

function listarConsumos() {
    listaConsumos.innerHTML = "";

    if (consumos.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum consumo registrado.";
        mensagem.style.textAlign = "center";
        mensagem.style.padding = "30px";
        listaConsumos.appendChild(mensagem);
        return;
    }

    consumos.forEach((consumo, indice) => {
        const card = document.createElement("article");
        card.className = "card-consumo";

        const conteudo = document.createElement("div");
        conteudo.className = "card-conteudo";

        const titulo = document.createElement("div");
        titulo.className = "card-titulo";
        titulo.textContent = `${Number(consumo.quantidadeEmMl).toFixed(0)} ml`;

        const informacao = document.createElement("div");
        informacao.className = "card-info";
        informacao.textContent = `${formatarData(consumo.data)} | Peso: ${Number(consumo.pesoAtualKg).toFixed(1)} kg`;

        conteudo.appendChild(titulo);
        conteudo.appendChild(informacao);

        conteudo.addEventListener("click", () => {
            editar(indice);
        });

        const btnLixeira = document.createElement("button");
        btnLixeira.type = "button";
        btnLixeira.className = "btn-lixeira";
        btnLixeira.innerHTML = "🗑";
        btnLixeira.title = "Excluir registro";

        btnLixeira.addEventListener("click", (evento) => {
            evento.stopPropagation();
            excluir(indice);
        });

        card.appendChild(conteudo);
        card.appendChild(btnLixeira);

        listaConsumos.appendChild(card);
    });
}

function atualizarTela() {
    atualizarResumo();
    listarConsumos();
}

function abrirCadastro() {
    indiceEditando = -1;

    tituloModal.textContent = "Novo consumo";
    btnSalvar.textContent = "Cadastrar";

    quantidade.value = "";
    peso.value = "";

    modalCadastro.classList.remove("escondido");
    quantidade.focus();
}

function editar(indice) {
    indiceEditando = indice;

    tituloModal.textContent = "Alterar consumo";
    btnSalvar.textContent = "Salvar";

    quantidade.value = consumos[indice].quantidadeEmMl;
    peso.value = consumos[indice].pesoAtualKg;

    modalCadastro.classList.remove("escondido");
    quantidade.focus();
}

function fecharCadastro() {
    modalCadastro.classList.add("escondido");
    formConsumo.reset();
    indiceEditando = -1;
}

function cadastrarOuEditar(evento) {
    evento.preventDefault();

    const quantidadeValor = Number(quantidade.value);
    const pesoValor = Number(peso.value);

    if (quantidadeValor <= 0 || pesoValor <= 0) {
        return;
    }

    if (indiceEditando === -1) {
        consumos.push({
            data: obterDataAtual(),
            quantidadeEmMl: quantidadeValor,
            pesoAtualKg: pesoValor
        });
    } else {
        consumos[indiceEditando].quantidadeEmMl = quantidadeValor;
        consumos[indiceEditando].pesoAtualKg = pesoValor;
    }

    salvarDados();
    fecharCadastro();
    atualizarTela();
}

function excluir(indice) {
    indiceExcluindo = indice;
    modalExcluir.classList.remove("escondido");
}

function cancelarExclusao() {
    indiceExcluindo = -1;
    modalExcluir.classList.add("escondido");
}

function confirmarExclusao() {
    if (indiceExcluindo === -1) {
        return;
    }

    consumos.splice(indiceExcluindo, 1);

    salvarDados();
    atualizarTela();
    cancelarExclusao();
}

function carregarTema() {
    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "escuro") {
        document.body.classList.add("tema-escuro");
        temaEscuro.checked = true;
    } else {
        document.body.classList.remove("tema-escuro");
        temaEscuro.checked = false;
    }
}

function alternarTema() {
    if (temaEscuro.checked) {
        document.body.classList.add("tema-escuro");
        localStorage.setItem("tema", "escuro");
    } else {
        document.body.classList.remove("tema-escuro");
        localStorage.setItem("tema", "claro");
    }
}

btnEntrar.addEventListener("click", abrirHome);

btnVoltar.addEventListener("click", abrirSplash);

btnAdicionar.addEventListener("click", abrirCadastro);

temaEscuro.addEventListener("change", alternarTema);

formConsumo.addEventListener("submit", cadastrarOuEditar);

btnFecharCadastro.addEventListener("click", fecharCadastro);

btnCancelarExclusao.addEventListener("click", cancelarExclusao);

btnConfirmarExclusao.addEventListener("click", confirmarExclusao);

modalCadastro.addEventListener("click", (evento) => {
    if (evento.target === modalCadastro) {
        fecharCadastro();
    }
});

modalExcluir.addEventListener("click", (evento) => {
    if (evento.target === modalExcluir) {
        cancelarExclusao();
    }
});

carregarTema();