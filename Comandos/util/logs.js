const { ApplicationCommandType, EmbedBuilder, Embed, ApplicationCommandOptionType} = require("discord.js")
const axios = require('axios');
const {api_square} = require("../../config.json")

module.exports = {
  name: "logs", // Coloque o nome do comando
  description: "Veja as logs do app", // Coloque a descrição do comando
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

    const msg = await interaction.reply({ content:" Aguarde um momento estou consultando a aplicação"})
   try {


    const response = await axios.get(`https://api.squarecloud.app/v2/apps/${id}/logs`, {
        headers: {
          'Authorization': api_square
        }
      });    

      

      const resp = response.data.response

        msg.edit({
            content:"Aqui está o resultado",
            embeds:[
                new EmbedBuilder()
                .setTitle(`Aqui está as logs`)
                .setDescription(`\`\`\`${resp.logs}\`\`\``)
                
            ]
        })

      


   } catch(err){
    console.log(err)
    msg.edit("Ocorreu um erro para ver as logs de sua aplicação")
   }

  }}