const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const { api_square } = require("../../config.json");
const { SquareCloudAPI } = require('@squarecloud/api');
const api = new SquareCloudAPI(api_square);
const path = require('path')
const axios = require('axios')


module.exports = {
  name: "upload",
  description: "Faça o upload de uma source",
  type: ApplicationCommandType.ChatInput,



  run: async (client, interaction) => {

    interaction.reply({
      content: 'Qual vai ser a source?',
    }).then((msg) => {
      const filter = (m) => m.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({
        filter,
        max: 1,
      });
    
      collector.on('collect', async (collectedMessage) => {
        
        if (collectedMessage.attachments.size > 0) {
          const attachment = collectedMessage.attachments.first();
          const temporaryFolder = './temp/'; 
    
          
          if (!fs.existsSync(temporaryFolder)) {
            fs.mkdirSync(temporaryFolder);
          }
    
          
          const newFileName = 'newFile.zip';
          
          const filePath = temporaryFolder + newFileName;
          
          
          const response = await axios({
            method: 'get',
            url: attachment.url,
            responseType: 'stream',
          });
    
          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);
    
          writer.on('finish', () => {


            try {
              const data = api.applications.create(filePath).then((data) => {
                interaction.channel.bulkDelete(5).then(() => {
                  interaction.channel.send({
                    content:"Notas da aplicação",
                    embeds: [
                      new EmbedBuilder()
                      .setTitle("Todas as informações da aplicação")
                      .addFields(
                        {
                          name:"⚙ | Id da aplicação",
                          value:`${data.id}`,
                          inline:true
                        },
                        {
                          name:"🎃 | Nome da aplicação",
                          value:`${data.tag}`,
                          inline:true
                        },
                        {
                          name:"🖼 | Avatar",
                          value:`[Clique aqui](${data.avatar})`,
                          inline:true
                        },
                        {
                          name:"🎨 | SubDominio",
                          value:`${data.subdomain === null ? "Não tem Sub-dominio" : data.subdomain}`,
                          inline:true
                        },
                        {
                          name:"🎮 | Ram da aplicação",
                          value:`${data.ram}`,
                          inline:true
                        },
                        {
                          name:"💻 | Cpu",
                          value:`${data.cpu}`,
                          inline:true
                        },
                        {
                          name:"⚙ | Linguagem",
                          value:`${data.language.name}`,
                          inline:true
                        },
                        {
                          name:"⚙ | Versão",
                          value:`${data.language.version}`,
                          inline:true
                        },
                      )
                    ]
                  })
                })
              }).catch((err) => {

                interaction.channel.bulkDelete(5).then(() => {
                  interaction.channel.send(`Ocorreu um erro para enviar, olhe suas logs`)
                })
                console.log(err)
              })
            } catch (err){
              msg.edit({content:"Ocorreu um erro para fazer o upload verifique as logs"})
              console.log(err)
              
            }






          });
        } else {
          
          interaction.followUp('Você não enviou um arquivo.');
        }
      });
    });


  }
};
