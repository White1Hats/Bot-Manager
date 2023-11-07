const { ApplicationCommandType, EmbedBuilder, Embed, ApplicationCommandOptionType} = require("discord.js")
const axios = require('axios');
const {api_square} = require("../../config.json")

module.exports = {
  name: "start", // Coloque o nome do comando
  description: "inicie alguma aplicação", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: "id",
        description: "Qual é o id da aplicação?",
        type: ApplicationCommandOptionType.String,
        required: true,
    },
],

  run: async (client, interaction) => {
    const id = interaction.options.getString("id")

     const msg = await interaction.reply({content:"estamos iniciando sua aplicação aguarde"})
  
    try { 

        const response = await axios.post(
            `https://api.squarecloud.app/v2/apps/${id}/start`,
            {},
            {
              headers: {
                'Authorization': api_square
              }
            }
          );

          msg.edit({content:" Sua aplicação foi alterada com sucesso"})

    } catch (err) {
        msg.edit({content:"Ocorreu um erro para iniciar sua aplicação, verifique as logs"})
        console.log(err)
    }




}}