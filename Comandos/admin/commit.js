const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const fs = require("fs");
const { api_square } = require("../../config.json");
const { SquareCloudAPI } = require('@squarecloud/api');
const api = new SquareCloudAPI(api_square);
const path = require('path')
const axios = require('axios')

module.exports = {
  name: "commit", 
  description: "faça commit de alguma aplicação",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: "id",
        description: "Qual é o id da aplicação?",
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    {
        name: "reinicialização",
        description: "Deseja ativar o reiniciar automatico?",
        type: ApplicationCommandOptionType.Boolean,
        required: true,
    },
],

  run: async (client, interaction) => {
    const id = interaction.options.getString("id")
    const reiniciar = interaction.options.getBoolean("reinicialização")


    const application = await api.applications.get(id)

    interaction.reply({
      content: 'Qual vai ser os arquivos commit?',
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
              const det = application.commit(filePath, undefined, reiniciar).then((data) => {
                interaction.channel.bulkDelete(5).then(() => {
                  interaction.channel.send("o commit foi feito com sucesso!")
                })
              }).catch((err) => {

                interaction.channel.bulkDelete(5).then(() => {
                  interaction.channel.send(`Ocorreu um erro para enviar, olhe suas logs`)
                })
                console.log(err)
              })
            } catch (err){
              msg.edit({content:"Ocorreu um erro para fazer o commit verifique as logs"})
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
