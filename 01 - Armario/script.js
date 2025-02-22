// objeto do usuário
const usuario = { nome: "Raphael", matricula: "123456", pendencia: false, acessibilidade: true };

// lista objetos de armários
const armarios = [
  { id: 1, formato: "padrao", status: true, acessivel: false, reserva: null, entrega: null  },
  { id: 2, formato: "padrao", status: true, acessivel: false, reserva: null, entrega: null  },
  { id: 3, formato: "padrao", status: true, acessivel: false, reserva: null, entrega: null  },
  { id: 4, formato: "padrao", status: false, acessivel: true, reserva: null, entrega: null  },
  { id: 5, formato: "padrao", status: false, acessivel: true, reserva: null, entrega: null  },
  { id: 6, formato: "duplo", status: true, acessivel: true, reserva: null, entrega: null  },
  { id: 7, formato: "duplo", status: false, acessivel: true, reserva: null, entrega: null  },
  { id: 8, formato: "duplo", status: false, acessivel: true, reserva: null, entrega: null  },  
];

// função para reserva do armário, incluindo as regras.
function reservarArmario() {


  // obter tipo de armário selecionado pelo usuário no html.
  let tipoSelecionado = document.getElementById("tipoArmario").value;
  
  // na lista, filtrar apenas os armários que estão disponíveis e que são acessiveis ao usuário.
  let armariosDisponiveis = armarios.filter(a => a.formato === tipoSelecionado && a.status === true && usuario.acessibilidade === a.acessivel);
  
  // caso não exista armário disponível, retorna para o usuário mensagem.
  if (armariosDisponiveis.length === 0) {
    document.getElementById("resultado").innerText = `Olá, ${usuario.nome}! Nenhum armário disponível para o tipo selecionado.`;
    return;
  }
  
  // Caso exista armário(s) disponíveil, seguimos sorteando uma opção. 
  let armarioSorteado = armariosDisponiveis[Math.floor(Math.random() * armariosDisponiveis.length)];
  
  // Depois localizamos o armário emprestado na lista de armarios e mudamos o status do armário.
  armarioSorteado.status = false;

  
  // Finalmente, mudamos a pendencia do usuário para verdadeira.
  usuario.pendencia = true;

  // Salva a data e hora no objeto do armário
  let dataHoraReserva = new Date();
  let dataHoraEntrega = new Date(dataHoraReserva);
  dataHoraEntrega.setHours(dataHoraEntrega.getHours() + 24);
  armarioSorteado.reserva = dataHoraReserva.toLocaleString("pt-BR");
  armarioSorteado.entrega = dataHoraEntrega.toLocaleString("pt-BR");

  // Impmimimos uma mensagem de reserva para o usuário.
  // Exibe no elemento resultado
  document.getElementById("resultado").innerHTML = `
  <strong>Olá, ${usuario.nome}!</strong> <br>
  O armário <strong>${armarioSorteado.id}</strong> foi reservado com sucesso. <br>
  <strong>Data e hora da reserva:</strong> ${armarioSorteado.reserva} <br>
  <strong>Data e hora de entrega:</strong> ${armarioSorteado.entrega}
`;


  console.log(usuario);
  console.log(armarios);

}