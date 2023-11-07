const { ApplicationCommandType, EmbedBuilder, Embed} = require("discord.js")
const axios = require('axios');
const {api_square} = require("../../config.json")

module.exports = {
  name: "information", // Coloque o nome do comando
  description: "Veja a informação da api-key.", // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    const response = await axios.get('https://api.squarecloud.app/v2/user', {
        headers: {
          'Authorization': api_square
        }
      });
    const user = response.data.response.user

    interaction.reply({
        content:"Informações de sua key",
        embeds:[
            new EmbedBuilder()
            .addFields(
                {
                    name:"👾  | Id do usuario",
                    value:`${user.id}`
                },
                {
                    name:"😋 | Tag do usuario",
                    value:`${user.tag}`
                },
                {
                    name:"🤨 | Email do usuario",
                    value:`${user.email}`
                },
            ),
            new EmbedBuilder()
            .setTitle(`Planos da key`)
            .addFields(
                {
                    name:"🥶 | Plano",
                    value:`${user.plan.name}`
                },
                {
                    name:"🔐 | Limite de ram",
                    value:`${user.plan.memory.limit}`,
                    inline:true
                },
                {
                    name:"🔑 | Ram disponivel",
                    value:`${user.plan.memory.available}`,
                    inline:true
                },
                {
                    name:"⛏ | Ram Usada",
                    value:`${user.plan.memory.used}`,
                    inline:true
                },
                {
                    name:"📢 | Duração do plano",
                    value:`${user.plan.duration === null ? "Tempo indeterminado" : user.plan.duration}`,
                },
            )
        ]
    })


    response.data.response.applications.map((apps, index) => {
        interaction.channel.send({
            embeds:[
                new EmbedBuilder()
                .setTitle(`Aplicação ${index + 1}`)
                .addFields(
                    {
                        name:"🔍 | Id de sua aplicação",
                        value:`${apps.id}`,
                        inline:true
                    },
                    {
                        name:"⚙ | Nome da aplicação",
                        value:`${apps.tag}`,
                        inline:true
                    },
                    {
                        name:"🛠 | Memoria ram",
                        value:`${apps.ram}`,
                        inline:true
                    },
                    {
                        name:"🧰 | Linguagem",
                        value:`${apps.lang}`,
                        inline:true
                    },
                    {
                        name:"🕶 | Cluster",
                        value:`${apps.cluster}`,
                        inline:true
                    },
                    {
                        name:"🤖 | Oque ele é?",
                        value:`${apps.isWebsite === false ? "\`é um Bot\`" : "\`É um Site\`"}`,
                        inline:true
                    },
                    {
                        name:`🖼 | Avatar`,
                        value:`[Clique aqui](${apps.avatar})`,
                        inline:true
                    }
                )
            ]
        })
    })



  }
}


