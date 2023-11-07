const { ApplicationCommandType, EmbedBuilder} = require("discord.js")
const axios = require('axios');
const {api_square} = require("../../config.json")

module.exports = {
  name: "estatiticas-square", // Coloque o nome do comando
  description: "Veja a informação da squarecloud.", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    const response = await axios.get('https://api.squarecloud.app/v2/service/statistics');

    const stats = response.data.response.statistics
    interaction.reply({
      content:"Aqui está as estatiticas da square cloud!",
      embeds:[
        new EmbedBuilder()
        .addFields(
          {
            name:"Usuarios",
            value:`${stats.users}`
          },
          {
            name:"Aplicações",
            value:`${stats.apps}`
          },
          {
            name:"WebSites",
            value:`${stats.websites}`
          },
          {
            name:"Latencia da square",
            value:`${stats.ping}`
          }
        )
      ]
    })

  }
}


