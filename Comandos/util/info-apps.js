const { ApplicationCommandType, EmbedBuilder, Embed, ApplicationCommandOptionType} = require("discord.js")
const axios = require('axios');
const {api_square} = require("../../config.json")

module.exports = {
  name: "info-app", // Coloque o nome do comando
  description: "Veja a informação do app", // Coloque a descrição do comando
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


    const response = await axios.get(`https://api.squarecloud.app/v2/apps/${id}`, {
        headers: {
          'Authorization': api_square
        }
      });    


      const resp = response.data.response

        msg.edit({
            content:"Aqui está o resultado",
            embeds:[
                new EmbedBuilder()
                .addFields(
                    {
                        name:"⚙ | Aplicação ID",
                        value:`${resp.id}`
                    },
                    {
                        name:"🎃 | Nome",
                        value:`${resp.name}`
                    },
                    {
                        name:"🖼 | Avatar",
                        value:`[Clique aqui](${resp.avatar})`
                    },
                    {
                        name:"👑 | Owner",
                        value:`${resp.owner}`
                    },
                    {
                        name:"🕶 | Cluster",
                        value:`${resp.cluster}`
                    },
                    {
                        name:"🧰 | Memoria Ram",
                        value:`${resp.ram}`
                    },
                    {
                        name:"💻 | Linguagem",
                        value:`${resp.language}`
                    },
                    {
                        name:"🤨 | É um site?",
                        value:`${resp.isWebsite === false ? "Não é um site" : "Sim é um website"}`
                    },
                    {
                        name:"😋 | é integrado no git?",
                        value:`${resp.gitIntegration === false ? "Não é integrado" : "é integrado"}`
                    },
                )
            ]
        })

      


   } catch(err){
    console.log(err)
   }

  }}