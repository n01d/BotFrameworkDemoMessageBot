var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Create your bot with a function to receive messages from the user
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("You said: %s", session.message.text);
// });

// Setup bot and root waterfall
//var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Hello User! Check out everything I can do.");
        session.beginDialog('rootMenu');
    },
    function (session, results) {
        session.endConversation("Goodbye until next time...");
    }
]);

// Add root menu dialog
bot.dialog('rootMenu', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Carousel|Different Cards|Typing|Random Text', { listStyle: builder.ListStyle.button });
    },        
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('CarouselDialog');
                break;
            case 1:
                session.beginDialog('CardDialog');
                break;
            case 2:
                session.beginDialog('TypinglDialog');
                break;
            case 3:
                session.beginDialog('magicBallDialog');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('rootMenu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

bot.dialog('CarouselDialog', [
    function (session, args) {
        var cards = getCardsAttachments(session);
        
            // create reply with Carousel AttachmentLayout
            var reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
        
            session.send(reply);
            builder.Prompts.text(session, "Waiting for input");
    },
    function (session, results) {
        session.endDialog("End Dialog");
        //session.beginDialog('rootMenu');
    }
]);

bot.dialog('CardDialog', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Hero Card|Thumbnail Card|Receipt Card|Sign-In Card|Animation Card|Video Card|Audio Card', { listStyle: builder.ListStyle.button });
    },        
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('HeroCardDialog');
                break;
            case 1:
                session.beginDialog('ThumbnailCardDialog');
                break;
            case 2:
                session.beginDialog('ReceiptCardDialog');
                break;
            case 3:
                session.beginDialog('SignInDialog');
                break;
            case 4:
                session.beginDialog('AnimationCardDialog');
                break;
                case 5:
                session.beginDialog('VideoCardDialog');
                break;
                case 6:
                session.beginDialog('AudioCardDialog');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('rootMenu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

bot.dialog('HeroCardDialog', [
    function (session, args) {
        var card = createHeroCard(session);
        
        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        builder.Prompts.text(session, "Waiting for input");
    },
    function (session, results) {
        session.endDialog("End Dialog");
        //session.beginDialog('rootMenu');
    }
]);

bot.dialog('ThumbnailCardDialog', [
    function (session, args) {
        var card = createThumbnailCard(session);
        
        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        builder.Prompts.text(session, "Waiting for input");
    },
    function (session, results) {
        session.endDialog("End Dialog");
        //session.beginDialog('rootMenu');
    }
]);

bot.dialog('ReceiptCardDialog', [
    function (session, args) {
        var card = createReceiptCard(session);
        
        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        builder.Prompts.text(session, "Waiting for input");
    },
    function (session, results) {
        session.endDialog("End Dialog");
        //session.beginDialog('rootMenu');
    }
]);

bot.dialog('SignInDialog', [
    function (session, args) {
        var card = createSigninCard(session);
        
        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        builder.Prompts.text(session, "Waiting for input");
    },
    function (session, results) {
        session.endDialog("End Dialog");
        //session.beginDialog('rootMenu');
    }
]);

bot.dialog('VideoCardDialog', [
    function (session, args) {
        var card = createVideoCard(session);
        
        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        builder.Prompts.text(session, "Waiting for input");
    },
    function (session, results) {
        session.endDialog("End Dialog");
        //session.beginDialog('rootMenu');
    }
]);

bot.dialog('AnimationCardDialog', [
    function (session, args) {
        var card = createAnimationCard(session);
        
        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        builder.Prompts.text(session, "Waiting for input");
    },
    function (session, results) {
        session.endDialog("End Dialog");
        //session.beginDialog('rootMenu');
    }
]);

bot.dialog('AudioCardDialog', [
    function (session, args) {
        var card = createAudioCard(session);
        
        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        builder.Prompts.text(session, "Waiting for input");
    },
    function (session, results) {
        session.endDialog("End Dialog");
        //session.beginDialog('rootMenu');
    }
]);

bot.dialog('TypinglDialog', [
    function (session, args) {
        session.sendTyping();
        setTimeout(function () {
            session.send("This took me long...");
            builder.Prompts.text(session, "Waiting for input");
        }, 5000);
        
    },
    function (session, results) {
                session.endDialog("End Dialog");
                //session.beginDialog('rootMenu');
    }
]);

// Magic 8-Ball
bot.dialog('magicBallDialog', [
    function (session, args) {
        builder.Prompts.text(session, "What is your question?");
    },
    function (session, results) {
        // Use the SDK's built-in ability to pick a response at random.
        session.endDialog(magicAnswers);
    }
]);

var magicAnswers = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];

function createHeroCard(session) {
    return new builder.HeroCard(session)
        .title('BotFramework Hero Card')
        .subtitle('Your bots — wherever your users are talking')
        .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
        .images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework', 'Get Started')
        ]);
}

function createThumbnailCard(session) {
    return new builder.ThumbnailCard(session)
        .title('BotFramework Thumbnail Card')
        .subtitle('Your bots — wherever your users are talking')
        .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
        .images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework', 'Get Started')
        ]);
}

function createReceiptCard(session) {
    return new builder.ReceiptCard(session)
        .title('John Doe')
        .facts([
            builder.Fact.create(session, '1234', 'Order Number'),
            builder.Fact.create(session, 'VISA 5555-****', 'Payment Method')
        ])
        .items([
            builder.ReceiptItem.create(session, '$ 38.45', 'Data Transfer')
                .quantity(368)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png')),
            builder.ReceiptItem.create(session, '$ 45.00', 'App Service')
                .quantity(720)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png'))
        ])
        .tax('$ 7.50')
        .total('$ 90.95')
        .buttons([
            builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', 'More Information')
                .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
        ]);
}

function createSigninCard(session) {
    return new builder.SigninCard(session)
        .text('BotFramework Sign-in Card')
        .button('Sign-in', 'https://login.microsoftonline.com')
}

function createAnimationCard(session) {
    return new builder.AnimationCard(session)
        .title('Microsoft Bot Framework')
        .subtitle('Animation Card')
        .image(builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png'))
        .media([
            { url: 'http://i.giphy.com/Ki55RUbOV5njy.gif' }
        ]);
}

function createVideoCard(session) {
    return new builder.VideoCard(session)
        .title('Big Buck Bunny')
        .subtitle('by the Blender Institute')
        .text('Big Buck Bunny (code-named Peach) is a short computer-animated comedy film by the Blender Institute, part of the Blender Foundation. Like the foundation\'s previous film Elephants Dream, the film was made using Blender, a free software application for animation made by the same foundation. It was released as an open-source film under Creative Commons License Attribution 3.0.')
        .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
        .media([
            { url: 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://peach.blender.org/', 'Learn More')
        ]);
}

function createAudioCard(session) {
    return new builder.AudioCard(session)
        .title('I am your father')
        .subtitle('Star Wars: Episode V - The Empire Strikes Back')
        .text('The Empire Strikes Back (also known as Star Wars: Episode V – The Empire Strikes Back) is a 1980 American epic space opera film directed by Irvin Kershner. Leigh Brackett and Lawrence Kasdan wrote the screenplay, with George Lucas writing the film\'s story and serving as executive producer. The second installment in the original Star Wars trilogy, it was produced by Gary Kurtz for Lucasfilm Ltd. and stars Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams, Anthony Daniels, David Prowse, Kenny Baker, Peter Mayhew and Frank Oz.')
        .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'))
        .media([
            { url: 'http://www.wavlist.com/movies/004/father.wav' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://en.wikipedia.org/wiki/The_Empire_Strikes_Back', 'Read More')
        ]);
}

function getCardsAttachments(session) {
    return [
        new builder.HeroCard(session)
            .title('Azure Storage')
            .subtitle('Offload the heavy lifting of data center management')
            .text('Store and help protect your data. Get durable, highly available data storage across the globe and pay only for what you use.')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/storage/media/storage-introduction/storage-concepts.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
            ]),

        new builder.ThumbnailCard(session)
            .title('DocumentDB')
            .subtitle('Blazing fast, planet-scale NoSQL')
            .text('NoSQL service for highly available, globally distributed apps—take full advantage of SQL and JavaScript over document and key-value data without the hassles of on-premises or virtual machine-based cloud database options.')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/documentdb/media/documentdb-introduction/json-database-resources1.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/documentdb/', 'Learn More')
            ]),

        new builder.HeroCard(session)
            .title('Azure Functions')
            .subtitle('Process events with a serverless code architecture')
            .text('An event-based serverless compute experience to accelerate your development. It can scale based on demand and you pay only for the resources you consume.')
            .images([
                builder.CardImage.create(session, 'https://azurecomcdn.azureedge.net/cvt-5daae9212bb433ad0510fbfbff44121ac7c759adc284d7a43d60dbbf2358a07a/images/page/services/functions/01-develop.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
            ]),

        new builder.ThumbnailCard(session)
            .title('Cognitive Services')
            .subtitle('Build powerful intelligence into your applications to enable natural and contextual interactions')
            .text('Enable natural and contextual interaction with tools that augment users\' experiences using the power of machine-based intelligence. Tap into an ever-growing collection of powerful artificial intelligence algorithms for vision, speech, language, and knowledge.')
            .images([
                builder.CardImage.create(session, 'https://azurecomcdn.azureedge.net/cvt-68b530dac63f0ccae8466a2610289af04bdc67ee0bfbc2d5e526b8efd10af05a/images/page/services/cognitive-services/cognitive-services.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/cognitive-services/', 'Learn More')
            ])
    ];
}