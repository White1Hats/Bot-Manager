const { ApplicationCommandType, EmbedBuilder, Embed, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder} = require("discord.js")
const axios = require('axios');
const {api_square} = require("../../config.json")

module.exports = {
  name: "backup", // Coloque o nome do comando
  description: "faça backup de alguma aplicação", // Coloque a descrição do comando
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

     const msg = await interaction.reply({content:"estamos baixando o backup sua aplicação aguarde"})
  
    try { 

        const response = await axios.get(`https://api.squarecloud.app/v2/apps/${id}/backup`, {
            headers: {
              'Authorization': api_square
            }
          });

          msg.edit({content:`${interaction.user}`,
        embeds:[
            new EmbedBuilder()
            .setTitle("Backup da aplicação")
            .setDescription(`Para Baixar basta [Clicar aqui](${response.data.response.downloadURL}) ou clicando no botão abaixo`)
        ],
        components:[
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel("Baixar Backup")
                .setStyle(5)
                .setURL(`${response.data.response.downloadURL}`)
            )
        ]
    
    })

    } catch {

        
        msg.edit({content:"Ocorreu um erro para fazer o backup sua aplicação"})


    }




}}