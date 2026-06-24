// Função para validar se o telefone tem um formato válido
// Permite validar tanto telefones móveis quanto fixos, dependendo do tamanho do telefone
function validatePhone(phone) {
    let regex;
    //Define a var da Expressão regular para verificar se o telefone tem um formato padrão 
    if (phone.length === 15) {
        regex = /^\(\d{2}\) \d{5}-\d{4}$/;
        // (xx) xxxxx-xxxx
    } else {
        regex = /^\(\d{2}\) \d{4}-\d{4}$/;
        // (xx) xxxx-xxxx
    }
    return regex.test(phone);
    // Retorna true se o telefone for válido conforme o padrão, ou false se não for
}

module.exports = validatePhone;
// Exporta a função para ser utilizada em outros módulos, como nos services
