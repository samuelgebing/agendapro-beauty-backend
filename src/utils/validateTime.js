const { ValidationError } = require('./appErrors');
// Classe para validar se o id tem um formato válido
class ValidateTime {
    // Retorna TRUE se for nulo, e FALSE caso não seja
    static isNull(time) {
        return !time || (typeof time === 'string' && time.trim() === ""); 
    }

    static isInvalid(time) {
        // 1. GARANTE QUE O PARÂMETRO É UMA STRING VÁLIDA
        if (!time || typeof time !== 'string') {
            // Se for um objeto Date nativo, converte para a string do formato longo
            if (time instanceof Date && !isNaN(time)) {
                time = time.toString();
            } else {
                return true; // Se for null, undefined ou objeto inválido, é considerado inválido
            }
        }
        // Regex 1: YYYY-MM-DD
        const regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;        
        // Regex 2: YYYY-MM-DD HH:mm:ss
        const regexDatetime = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d$/;
        // Regex 3: HH:mm:ss
        const regexHour = /^(0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d$/;
        // Regex 4: HH:mm
        const regexHourShort = /^(0\d|1\d|2[0-3]):[0-5]\d$/; 
        // Regex 5: Detecta o formato longo de data do JS (procura a estrutura de hora lá dentro)
        const regexLongDate = /\s(0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d\sGMT/;
        // Regex 6: YYYY-MM-DDTHH:mm:ss.mmmZ, sendo xxxx-xx-xxTxx:xx:xx.xxxZ
        const regexISO = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/

        // Guarda as validações
        const isDate = regexDate.test(time);
        const isDatetime = regexDatetime.test(time);
        const isHour = regexHour.test(time);
        const isHourShort = regexHourShort.test(time);
        const isLongDate = regexLongDate.test(time);
        const isISO = regexISO.test(time);

        // Verifica se a string se encaixa em algum dos formatos --> retorna TRUE se for inválido
        if (!isDate && !isDatetime && !isHour && !isHourShort && !isLongDate && !isISO)
            return true;

        if (isDate || isDatetime || isLongDate || isISO) {
            // Validação lógica de anos bissextos
            let year, month, day;
            if (isLongDate) {
                // Sat Jun 01 2024 10:00:00 GMT-0300 (Horário Padrão de Brasília)
                const parts = time.split(" ");
                // Objeto auxiliar para converter o nome de três letras do mês em número
                const monthsMap = {
                    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
                    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
                };

                month = monthsMap[parts[1]]; // "Jul" vira 7
                day = Number(parts[2]);      // "10" vira 10
                year = Number(parts[3]);     // "2026" vira 2026
            } else if (isISO) {
                // 2026-07-10T17:15:10.693Z
                const [datePart, timePart] = time.split("T");
                [year, month, day] = datePart.split("-").map(Number);

            } else {
                // 2026-07-10 17:15
                // 2026-07-10 17:15:10
                const [datePart, timePart] = time.split(" ");
                [year, month, day] = datePart.split("-").map(Number);
            }

            // Validação de ano bissexto
            const daysPerMonth = [
                31, 
                (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 
                31, 30, 31, 30, 31, 31, 30, 31, 30, 31
            ];
            
            if (day > daysPerMonth[month - 1]) return true;
        }

        // Se passou por todas as regras, o formato e os valores são válidos (não é inválido -> false)
        return false;
    }
    
    /**
     * Converte automaticamente strings de data/hora para o formato de destino solicitado.
     * 
     * Formatos de entrada suportados (time):
     *  - "YYYY-MM-DD"                     (Ex: "2024-06-01")
     *  - "YYYY-MM-DD HH:mm:ss"            (Ex: "2024-06-01 10:00:00")
     *  - "YYYY-MM-DD HH:mm"               (Ex: "2024-06-01 10:00")
     *  - "HH:mm"                          (Ex: "10:00")
     *  - "HH:mm:ss"                       (Ex: "10:00:00")
     *  - "Sat Jun 01 2024 10:00:00 GMT"   (Ex: Date String longa do JavaScript)
     * 
     * Formatos de destino suportados (targetFormat):
     *  - 'date'       -> Retorna "YYYY-MM-DD"
     *  - 'datetime'   -> Retorna "YYYY-MM-DD HH:mm:ss"
     *  - 'hour'       -> Retorna "HH:mm:ss"
     *  - 'hourShort'  -> Retorna "HH:mm"
     * 
     * @param {string} time - A string contendo a data ou hora inicial.
     * @param {string} targetFormat - O formato de saída desejado ('date', 'datetime', 'hour', 'hourShort').
     * @returns {string} A string convertida no formato solicitado.
     * @throws {ValidationError} Se o valor for nulo, vazio ou impossível de interpretar.
     */
    static convert(time, targetFormat) {
        if (this.isNull(time) || this.isInvalid(time))
            throw new ValidationError(`Não foi possível converter "${time}" para "${targetFormat}".`);

        let dateObj = null;

        // Cenário 1: Se for APENAS horário (HH:mm ou HH:mm:ss), injeta uma data neutra para o construtor Date funcionar
        if (/^\d{2}:\d{2}/.test(time)) 
            dateObj = new Date(`1970-01-01T${time.length === 5 ? time + ':00' : time}`);
         
        // Cenário 2: Se for formato longo do JS, o construtor Date interpreta nativamente respeitando o fuso local
        else if (/\sGMT[+-]\d{4}/.test(time)) 
            dateObj = new Date(time);
         
        // Cenário 3: Se for YYYY-MM-DD com ou sem horário, troca o espaço por 'T' para evitar desvios de fuso do navegador
        else {
            const normalized = time.replace(' ', 'T');
            dateObj = new Date(normalized);
        }

        // Validação central do motor JavaScript
        if (isNaN(dateObj.getTime())) {
            throw new ValidationError(`Formato de data inválido ou irreconhecível: "${time}".`);
        }

        // Extração automática e padronização dos componentes locais
        const pad = (n) => n.toString().padStart(2, '0');
        const yyyy = dateObj.getFullYear();
        const mm = pad(dateObj.getMonth() + 1);
        const dd = pad(dateObj.getDate());
        const hh = pad(dateObj.getHours());
        const min = pad(dateObj.getMinutes());
        const ss = pad(dateObj.getSeconds());

        // Montagem dinâmica baseada unicamente no targetFormat exigido
        switch (targetFormat) {
            case 'date':
                return `${yyyy}-${mm}-${dd}`;
            case 'datetime':
                return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
            case 'hour':
                return `${hh}:${min}:${ss}`;
            case 'hourShort':
                return `${hh}:${min}`;
            default:
                throw new ValidationError(`Formato de destino '${targetFormat}' não é reconhecido.`);
        }
    }
    
    static timeToMinutes(timeStr) {
        if (this.isInvalid(timeStr)) return 0;
        const cleanTime = this.convert(timeStr, 'hourShort');
        const [hours, minutes] = cleanTime.split(':').map(Number);
        return (hours * 60) + minutes;
    }

    static minutesToHour(totalMinutes) {
        if (isNaN(totalMinutes) || totalMinutes < 0) return "00:00";
        const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const minutes = (totalMinutes % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

module.exports = ValidateTime;
// Exporta a classe para ser utilizada em outros módulos, como nos services