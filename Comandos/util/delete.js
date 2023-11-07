const { ApplicationCommandType, EmbedBuilder, Embed, ApplicationCommandOptionType} = require("discord.js")
const axios = require('axios');
const {api_square} = require("../../config.json")

module.exports = {
  name: "delete", // Coloque o nome do comando
  description: "delete alguma aplicação", // Coloque a descrição do comando
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

     const msg = await interaction.reply({content:"estamos excluindo sua aplicação aguarde"})
  
    try { 

        const response = await axios.delete(
            `https://api.squarecloud.app/v2/apps/${id}/delete`,
            {
              headers: {
                'Authorization': api_square
              }
            }
          );

          msg.edit({content:" Sua aplicação foi excluida com sucesso"})

    } catch {
        msg.edit({content:"Ocorreu um erro para excluir sua aplicação"})
    }




}}