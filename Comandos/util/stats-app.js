const { ApplicationCommandType, EmbedBuilder, Embed, ApplicationCommandOptionType} = require("discord.js")
const axios = require('axios');
const {api_square} = require("../../config.json")

module.exports = {
  name: "stats-app", // Coloque o nome do comando
  description: "Veja o status do app", // Coloque a descrição do comando
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

    const msg = await interaction.reply({content:" Estamos consultando os status de sua aplicação"})
    try {

        const response = await axios.get(`https://api.squarecloud.app/v2/apps/${id}/status`, {
            headers: {
              'Authorization': api_square
            }
          });
          const resp = response.data.response
          msg.edit({
              content:"Aqui está o status de sua aplicação",
              embeds:[
                  new EmbedBuilder()
                  .addFields(
                      {
                          name:"💻 | Cpu",
                          value:`${resp.cpu}`,
                          inline:true 
                      },
                      {
                          name:"🧠 | Memória Ram",
                          value:`${resp.ram}/100MB`,
                          inline:true
                      },
                      {
                          name:"💾 | SSD",
                          value:`${resp.storage}`,
                          inline:true
                      },
                      {
                          name:"🌐 | Network(total)",
                          value:`${resp.network.total}`,
                          inline:true
                      },
                      {
                          name:"🌐 | Network(Now)",
                          value:`${resp.network.now}`,
                          inline:true
                      },
                      {
                          name:"📩 | Request",
                          value:`${resp.requests}`,
                          inline:true
                      },
                      {
                          name:`${resp.running === true ? "🟢 | Status" : "🔴 Status"}`,
                          value:`${resp.running === true ? "\`Em Execução\`" : "\`Offline\`"}`,
                          inline:true
                      },
                      {
                        name:"⏰ | Uptime",
                        value:`${resp.uptime === null ? "`Não Iniciado`" : `<t:${~~(resp.uptime / 1000)}:R>`}`,
                        inline:true
                      }
                  )
              ]
          })
          

    } catch(err){
        msg.edit("Ocorreu um erro para consultar os status, verifique as logs")
        console.log(err)

    }

}}