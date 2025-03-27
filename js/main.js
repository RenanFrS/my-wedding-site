// Define a data do evento
const eventoData = new Date("September 06, 2026 00:00:00").getTime();
const dataAcionamento = new Date("September 08, 2026 00:00:00").getTime();

// Atualiza a contagem regressiva a cada segundo
const intervalo = setInterval(() => {
    const agora = new Date().getTime();
    const diferenca = eventoData - agora;
    const diferencaAcionamento = dataAcionamento - agora;

    // Calcula dias, horas, minutos e segundos
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

    // Atualiza o botão com a contagem regressiva
    const botao = document.querySelector(".huge-btn");
    if (botao) {
        botao.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }

    // Quando chegar a 8/9/2026, chama a função eventoChegou()
    if (diferencaAcionamento < 0) {
        clearInterval(intervalo);
        eventoChegou();
    }
}, 1000);

// Função personalizada para quando chegar em 08/09/2026
function eventoChegou() {
    const botao = document.querySelector(".huge-btn");
    if (botao) {
        botao.textContent = "Nosso Grande Dia Chegou!";
        // botao.style.backgroundColor = "green"; Exemplo: mudar a cor do botão
    }
}



const parallax = document.getElementById("home-img-lg");
const parallax1 = document.getElementById("parallax1");
const parallax2 = document.getElementById("parallax2");

window.addEventListener("scroll", function()
{
    let offset = window.pageYOffset;
    parallax.style.backgroundPositionX = offset*(-0.3)-100 + "px";
})


window.addEventListener("scroll", function()
{
    let offset = window.pageYOffset;
    offset-=3100;
    parallax1.style.backgroundPositionY = offset*(0.1) + "px";
})

window.addEventListener("scroll", function()
{
    let offset = window.pageYOffset;
    offset-=4800;
    parallax2.style.backgroundPositionY = offset*(-0.1) + "px";
})

function myFunction() {
    document.getElementById("check").checked = false;
  }


  
function reveal() {
var reveals = document.querySelectorAll(".reveal");
  
for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;
  
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
}
  
window.addEventListener("scroll", reveal);