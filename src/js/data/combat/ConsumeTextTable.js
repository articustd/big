let voreText

//Gets descriptions of the player voring opponents based on the size difference from ranging -2 (much larger) to 2 (much smaller), and a boolean replacing vore with an alternative
//Returns an object containing strings with different results: Eat, Anal, Unbirth, Urethral
export function getVoreText(sizeDiff,  replaceVore){
    let introText
    switch (sizeDiff){
        //Much smaller
        case 2:
            introText = `Looking down you see the $enemy.name. Their form before you, small enough to fit in your paw.<br>`;
            voreText = {
                Eat: introText + `Picking them up you play with them for a bit, rolling them between your large digits before giving them a massive lick. Their taste is all consuming, it sends a thrill down your spine. You can imagine what it would be like to consume them, but why do you have to imagine when you can make it reality?
                <br>Giving them another lick, you revel in their flavor. Edging closer and closer to a euphoric high. Then, letting the feeling over take you, you use your tounge to scoop them up and slide them into your hungry maw.
                <br>The feeling is more than you imagined. Their body between the roof of your maw and your tounge delights the senses. The taste, the feeling! Your tounge moves on it's own and proceeds to explore every inch of their body. Wrapping your tounge around their most sensitive regions, you elicit a shudder from them.
                <br>You continue to poke and prod with your tounge while also exploring your own body. The prey in your maw finally squeaks in lust as you've pushed them over the edge. Not only can they not take it anymore, but you yourself are pushed over the edge. As you both climax, you instinctively swallow and can feel the $enemy.name slide down your throat. As you're recovering from your climax, you move a paw slowly up to your throat and message the bulge further down.
                <br>When the prey reaches your stomach, they make a slight bump under your skin. Sitting back, you rub the bump and revel in the afterglow of your consumption. After coming down from the experience, you pick up everything from your altercation and move on, patting your stomach.`,
                Anal: introText + `You wriggle them around in your paws, turning them this way, and that way. They seem to be of a very <i>fun</i> size. They are small enough for you to use them as an anal bead. It would be <i>thrilling</i>, just stuff them up your ass, and not needing to take them out as they slowly turn into more growth to you.<br>
                In fact, why would you keep it as a fantasy? You roll the unconsious $enemy.name into a ball and push it into your sphincter. Your apparently concious prey wriggles in your sphincter, both you and them can't supress a moan. The chorus of sound only serves to work your ass faster as your prey quickly disappears in between your legs. But it's far from over. You can feel them wriggle in your intestines, slowly forced into your stomach. And when they hit their final destination, they dissolve into. It gives you a funny feeling and you burp. Heh, time to move on.`,
                Unbirth: introText + `They're so small that they could've been a newborn. And here they are, right before you, ready to be snatched up. You gently scoop them up, and get a feel for them. They really are tiny. With your free hand you massage your vagina, loosening it up for the upcoming small fry. You massage your clitoris and it soon starts leaking. With wet fingers, you easily set them on their way to your womb. They try to protest, but any sound they can produce sounds more like an infant than any grown adult could ever produce. You rub your legs to make the process faster and moan as you can feel them go up the tract. It doesn't take long for them to be absorbed by your body, ready to be turned into more mass, as small as it is.`,
                Urethral: introText + `The excitement of battle does not do 
                Your dick is rock hard after all this fighting. It's vying for your attention, and oh boy, you now have a good way to satisfy it. `
            }

            if (replaceVore){
                voreText={
                    Eat: introText + `With even the smallest of tugs, you absorb their essence, dispersing their aura around throughout your whole body`,
                    Anal: introText + `With even the smallest of tugs, you absorb their essence, filling your ass with some growing aura.`,
                    Unbirth: introText + `With even the smallest of tugs, you absorb their essence filling your vagina with some growing aura.`,
                    Urethral: introText + `With even the smallest of tugs, you absorb their essence filling your dick with some growing aura.`
                }
            }
        break

        //Smaller
        case 1:
            introText = `Looking down you see the $enemy.name. Their form before you, coming up to around your hip.<br>`;
            voreText = {
                Eat: introText + `Grabbing them by their waist, you hoist them up to your eyeline. Their smell is... intoxicating, you wonder what their taste might be. You give them a quick lick on their face and the flavor explodes in your mind. Unconsciously you stare into space and drool for a moment, lost in the rapture of the $enemy.name's taste.
                <br>After a moment you snap back to reality and know you must have more, much more. You start licking your prey all over, slowly and methodically. As the tounge massaging continues $enemy.name lets out a small moan as you work your way around their more erotic areas. This excitement also gets you hot and bothered, you straddle the prey on your shoulders to continue and to also move a paw to pleasure yourself.
                <br>You begin to moan along with your prey as the feeling builds up, ultimately leading to a moment of release. You and your prey cry out when the moment hits. As you cry out, you take your free paw and shove the $enemy.name into your maw and proceed to push them down into your gaping void. A sizeable bulge can be seen in your throat as the prey slides down. To help out you take a paw to coax them to your waiting stomach.
                <br>Pushing and pulling, the prey make their way to your stomach. With a final push, your stomach distends to a sizable bump. You take a moment to bask in your meal, rub your belly, and collect everything that your prey had dropped.`,
                Anal: introText + ``,
                Unbirth: introText + `They look so small and helpless to you, like a baby, and it makes your nethers ache. Egged on by your stray thoughts it becomes wetter and wetter, eager add them to your womb. You drip all over your prey as it murmurs in its daze. They're so cute when they're so small. You caress their cheek as you lower yourself over them. "Don't worry little one, you will have a loving and warm home soon." you say with a smile, knowing that their life will be fortfeit by fueling your growth.<br>
                Your snatch brushes their feet as you lower over them, it undulates in anticipation. As your nether region touches the $enemy.name's feet it begins its work, pulling them in. Your vagina stretches with great effort as their feet enters you and suddenly finds its grip. You moan in ecstacy as you feel their legs getting sucked in, your lady parts and womb hungering for more. You huff and puff as you can feel their hips touch yours.<br>
                Suddenly the world around you spins as the rest of your prey's body slorps into your body. You can hear one last cry as their body fully disappears inside of your womb. You lose your balance and nearly fall to the ground, but you catch yourself. You wobble a bit as you stand again and notice that your cute little prey has filled out your womb a bit. After puffing somewhat, you move on, ready for more.`,
                Urethral: introText + ``
            }
            
            if (replaceVore){
                voreText= {
                    Eat: introText + `Your aura dwarves theirs, with a small effort, you absorb their essence.`,
                    Anal: introText + `Your aura dwarves theirs, with a small effort, you absorb their essence, filling your ass.`,
                    Unbirth: introText + `Your aura dwarves theirs, with a small effort, you absorb their essence, filling your vagina.`,
                    Urethral: introText + `Your aura dwarves theirs, with a small effort, you absorb their essence, filling your dick.`
                }
            }
        break

        //Same
        case 0:
            introText = `You see the $enemy.name at eye level. Their form coming in roughly the same size as you.<br>`;
            voreText = {
                Eat: introText +`You let out a long breath, the tension of the fight easing from your body. As you let in a deep breath you catch the smell of your prey, it smells... delicious. As you think on the aroma, a bit of drool slips from your muzzle. The thought of a decently sized meal is enticing.
                <br>Taking a minute to ponder which way to go with eating your prey you decide on head first, less complaining if they decide to wake up. Shuffling around to their head you pick them up by the shoulders, open your mouth, and proceed with your delectable consumption.
                <br>Sliding their head into your maw, the taste is indescribable, it's everything you had hoped for from the smell. Pulling your prey in, you slowly fit their shoulders in your jaw and let out a shudder. The feeling of fullness is starting to overtake you. As you get closer to the $enemy.name's more erotic areas, a soft moan escapes your throat. However the moan is not your own, it appears your prey has been caught in the throes of pleasure from their dire experience. The thoughts and feelings of your prey's delight begins to overtake you and forms a duet of pleasure.
                <br>The cacophony of lust continues as you work your way down to the end of your meal. A rather sizable bulge is showing in your stomach with your prey halfway through their journey. With a final slurp, you both let go and the moment takes over both of you. Laying back, the $enemy.name in your throat has completed their fated path and has enlarged your stomach to the point of making it difficult to reach around it.
                <br>Rubbing your large gut you slowly get up and wobble a little bit as you find your footing. Thankfully you had grabbed all of your loot before your meal. Grabbing your things you waddle of, full and content.`,
                Anal: introText + ``,
                Unbirth: introText + `That's quite big for your snatch, but it might fit.`,
                Urethral: introText + ``
            }
            if (replaceVore){
                voreText = {
                    Eat: introText + `Same size! Disabled eat!`,
                    Anal: introText + `Same size! Disabled anal!`,
                    Unbirth: introText + `Same size! Disabled unbirth!`,
                    Urethral: introText + `Same size! Disabled urethral!`
                }
            }
        break

        //Larger
        case -1:
            introText = `Looking up you see the $enemy.name. Their form slightly looming in front of you.<br>`;
            voreText = {
                Eat: introText +`Larger! eat`,
                Anal: introText + `Larger! anal`,
                Unbirth: introText + `Larger! unbirth`,
                Urethral: introText + `Larger! urethral`
            }
            if (replaceVore){
                voreText = {
                Eat: introText + `Larger! Disabled eat!`,
                Anal: introText + `Larger! Disabled anal!`,
                Unbirth: introText + `Larger! Disabled unbirth!`,
                Urethral: introText + `Larger! Disabled urethral!`
                }
            }
        break

        //Much larger
        case -2:
            introText = `Looking up you see the $enemy.name. Their stature dwarfing yours.<br>
            @@color:transparent;Wow! I don't even know how you got here, but you did! Congratulations!<br>@@`;
            voreText = {
                Eat: introText +`"That wasn't even close to fair!" you scream as you stare daggers at your downed opponent. Miracle of miracles though, you beat them and you're not really sure how! You know for one thing though: you will take your prize no matter what. Patting your empty stomach you make your way to the $enemy.name's head to start your meal.
                <br>Unhinging your jaw you start to slide the huge cranium into your maw. It's crazy to you how this much can fit into you, almost unnatural. The head fills your mouth, and you start to choke down their neck. A feeling of unease starts to creep in.
                <br>The going is extremely slow, you've been at it for 10 minutes now and just reached your prey's shoulders. Wincing, you stretch your mouth as wide as it can go, barely fitting in their shoulders. The worst behind you, you feel the unease starting to wane. Sliding further down, you start enjoying the challenge with an extremely muffled moan reverberating your body. Except, that wasn't yours...
                <br>For some reason, your prey is excited with either the sensation or the predicament, you're not sure which, but it doesn't really matter. All that matters is that you finish your meal before you're unable to. It actually gets a bit exciting. Reaching below their waist, you are less pulling them in, and more of dragging yourself further down their body. It shouldn't be much further, but your stomach already looks like you've swallowed several shipping containers.
                <br>At last your reach the $enemy.name's feet and slurp with everything you have. As they finish their journey to your stomach, you take a deep breath from the feast. You're resting on your massive stomach, arms hanging down unable to fit around your sides.`,
                //<br>You're not sure how, but you think you'll have to convice someone larger to carry you around. Good luck with that!`,
                Anal: introText + `Much larger! anal`,
                Unbirth: introText + `Much larger! unbirth`,
                Urethral: introText + `Much larger! urethral`
            }
            if (replaceVore){
                voreText = {
                Eat: introText + `Much larger! Disabled eat!`,
                Anal: introText + `Much larger! Disabled anal!`,
                Unbirth: introText + `Much larger! Disabled unbirth!`,
                Urethral: introText + `Much larger! Disabled urethral!`
                }
            }
        break

        //Oooooffffff
        default: voreText = {
            Eat: `Something went wrong! Regular edition!`,
            Anal: `Something went wrong! Ass edition!`,
            Unbirth: `Something went wrong! Vagina edition!`,
            Urethral: `Something went wrong! Dick edition!`
        }
    }
    return voreText
}