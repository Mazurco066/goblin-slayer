new Vue({
    el: '#app',
    data: {
        playerHp: 100,
        goblinHp: 100,
        running: false,
        cooldown: 0,
        healCooldown: 0,
        logs: []
    },
    computed: {
        hasResult() {
            return this.playerHp <= 0 || this.goblinHp <= 0
        }
    },
    methods: {
        startGame() {
            this.running = true
            this.playerHp = 100
            this.goblinHp = 100
            this.cooldown = 0
            this.healCooldown = 0
            this.logs = []
        },
        attack(special) {
            if (special) {
                if (this.cooldown <= 0) {
                    this.hurt('goblinHp', 5, 10, special, 'Goblin Slayer', 'Goblin', 'player')
                    this.cooldown = 3
                } else {
                    this.registerLog(`Goblin Slayer missed the attack. Wait for ${this.cooldown} turns to use heavy atk again!`, 'player')
                    if (this.cooldown > 0) this.cooldown -= 1
                }
            } else {
                this.hurt('goblinHp', 5, 10, special, 'Goblin Slayer', 'Goblin', 'player')
                if (this.cooldown > 0) this.cooldown -= 1
            }
            if (this.healCooldown > 0) this.healCooldown -= 1
            if (this.goblinHp > 0) this.hurt('playerHp', 7, 14, false, 'Goblin', 'Goblin Slayer', 'goblin')
        },
        hurt(atr, min, max, special, src, target, cls) {
            const plus = special ? 8 : 0
            let hurt = this.generateRandom(min + plus, max + plus)
            this[atr] = Math.max(this.playerHp - hurt, 0)
            this.registerLog(`${src} hit ${target} with ${hurt} damage.`, cls)
        },
        healAndHurt() {
            if (this.healCooldown <= 0) {
                this.heal(10, 15)
                this.hurt('playerHp', 7, 12, false, 'Goblin', 'Goblin Slayer', 'goblin')
                if (this.cooldown > 0) this.cooldown -= 1
                this.healCooldown = 1
            } else {
                this.registerLog(`Goblin Slayer cannot heal now, wait for ${this.healCooldown} turn before healing.`, 'player')
                this.hurt('playerHp', 7, 12, false, 'Goblin', 'Goblin Slayer', 'goblin')
                if (this.cooldown > 0) this.cooldown -= 1
                if (this.healCooldown > 0) this.healCooldown -= 1
            }
        },
        heal(min, max) {
            const heal = this.generateRandom(min, max)
            this.playerHp = Math.min(this.playerHp + heal, 100)
            this.registerLog(`Goblin Slayer healed ${heal} hp points.`, 'player')
        },
        generateRandom(min, max) {
            return Math.round(Math.random() * (max - min) + min)
        },
        registerLog(text, cls) {
            this.logs.unshift({ text, cls })
        }
    },
    watch: {
        hasResult(value) {
            if (value) this.running = false
        }
    }
})