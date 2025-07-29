document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeParticleSystem();
    initializeTerminalAnimation();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    triggerSectionAnimation(section);
                }
            });
        });
    });

    window.addEventListener('scroll', updateNavOnScroll);
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        if (section.classList.contains('active')) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateElements(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category, .cert-badge, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

function animateElements(container) {
    const timeline = container.querySelectorAll('.timeline-item');
    const skills = container.querySelectorAll('.skill-category');
    const badges = container.querySelectorAll('.cert-badge');
    
    timeline.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 300);
    });
    
    skills.forEach((skill, index) => {
        setTimeout(() => {
            skill.style.opacity = '1';
            skill.style.transform = 'translateX(0)';
        }, index * 300);
    });
    
    badges.forEach((badge, index) => {
        setTimeout(() => {
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
        }, index * 150);
    });
}

function triggerSectionAnimation(section) {
    const animatedElements = section.querySelectorAll('.skill-category, .cert-badge, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
    
    setTimeout(() => {
        animateElements(section);
    }, 100);
}

function initializeParticleSystem() {
    const heroContainer = document.querySelector('.hero-container');
    if (!heroContainer) return;
    
    for (let i = 0; i < 15; i++) {
        createFloatingParticle(heroContainer);
    }
}

function createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('floating-particle');
    
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 10 + 15;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(0,255,255,0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatParticle ${duration}s linear infinite ${delay}s;
        z-index: 1;
    `;
    
    container.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createFloatingParticle(container);
        }
    }, (duration + delay) * 1000);
}

function initializeTerminalAnimation() {
    const terminal = document.getElementById('terminal-body');
    if (!terminal) return;
    
    const scenarios = [
        {
            command: 'nmap -sS -O 192.168.1.0/24',
            outputs: [
                'Starting Nmap 7.94 ( https://nmap.org )',
                'Nmap scan report for 192.168.1.1',
                'Host is up (0.001s latency).',
                'PORT     STATE SERVICE',
                '22/tcp   open  ssh',
                '80/tcp   open  http',
                '443/tcp  open  https'
            ],
            finalOutput: 'Nmap done: 254 IP addresses scanned'
        },
        {
            command: 'gobuster dir -u https://target.com -w common.txt',
            outputs: [
                'Gobuster v3.6',
                'by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)',
                '===============================================================',
                'Starting gobuster in directory enumeration mode'
            ],
            finalOutput: 'Found 12 directories - scan complete'
        },
        {
            command: 'nikto -h https://target.com',
            outputs: [
                '- Nikto v2.5.0',
                '+ Target IP:          10.0.0.1',
                '+ Target Hostname:    target.com',
                '+ Scanning target.com...'
            ],
            finalOutput: '+ Server: nginx/1.18.0 - scan complete'
        }
    ];
    
    let currentScenario = 0;
    
    function runTerminalScenario() {
        const scenario = scenarios[currentScenario];
        
        // Clear terminal except for the prompt
        terminal.innerHTML = `
            <div class="terminal-line">
                <span class="prompt">root@security:~$</span>
                <span class="cursor">_</span>
            </div>
        `;
        
        const currentLine = terminal.querySelector(".terminal-line");
        const cursor = currentLine.querySelector(".cursor");
        
        // Type the command
        setTimeout(() => {
            cursor.style.display = "none";
            const commandSpan = document.createElement("span");
            commandSpan.className = "command";
            currentLine.insertBefore(commandSpan, cursor);
            
            typeWriter(commandSpan, scenario.command, () => {
                // After command is typed, show outputs
                setTimeout(() => {
                    showOutputs(scenario.outputs, scenario.finalOutput);
                }, 500);
            });
        }, 1000);
    }
    
    function showOutputs(outputs, finalOutput) {
        let outputIndex = 0;
        
        function showNextOutput() {
            if (outputIndex < outputs.length) {
                const outputLine = document.createElement("div");
                outputLine.className = "terminal-line";
                outputLine.innerHTML = `<span class="output">${outputs[outputIndex]}</span>`;
                terminal.appendChild(outputLine);
                outputIndex++;
                setTimeout(showNextOutput, 300);
            } else {
                // Show final output
                setTimeout(() => {
                    const finalLine = document.createElement("div");
                    finalLine.className = "terminal-line";
                    finalLine.innerHTML = `<span class="output success">${finalOutput} ✓</span>`;
                    terminal.appendChild(finalLine);
                    
                    // Add new prompt
                    setTimeout(() => {
                        const newPromptLine = document.createElement("div");
                        newPromptLine.className = "terminal-line";
                        newPromptLine.innerHTML = `
                            <span class="prompt">root@security:~$</span>
                            <span class="cursor">_</span>
                        `;
                        terminal.appendChild(newPromptLine);
                        
                        // Move to next scenario
                        currentScenario = (currentScenario + 1) % scenarios.length;
                        setTimeout(runTerminalScenario, 3000);
                    }, 1000);
                }, 800);
            }
        }
        
        showNextOutput();
    }
    
    // Start the first scenario after initial delay
    setTimeout(runTerminalScenario, 3000);
}

function typeWriter(element, text, callback) {
    element.textContent = '';
    let i = 0;
    
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
            if (callback) setTimeout(callback, 2000);
        }
    }, 100);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(100vh) translateX(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .skill-category, .cert-badge, .timeline-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .skill-category {
        transform: translateX(-30px);
    }
    
    .cert-badge {
        transform: scale(0.8);
    }
    
    .floating-particle {
        filter: blur(0.5px);
    }
    
    .hero-title .title-line:nth-child(1) {
        animation-delay: 0.5s;
    }
    
    .hero-title .title-line:nth-child(2) {
        animation-delay: 1s;
    }
    
    .shape-1, .shape-2, .shape-3, .shape-4 {
        opacity: 0.7;
    }
    
    .shape-1:hover, .shape-2:hover, .shape-3:hover, .shape-4:hover {
        opacity: 1;
        transform: scale(1.1);
        transition: all 0.3s ease;
    }
    
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('mousemove', function(e) {
    const nodes = document.querySelectorAll('.cyber-node');
    nodes.forEach((node, index) => {
        const speed = (index + 1) * 0.02;
        const x = (e.clientX - window.innerWidth / 2) * speed;
        const y = (e.clientY - window.innerHeight / 2) * speed;
        
        node.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.abs(x) * 0.001})`;
    });
});

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const nodes = document.querySelectorAll('.cyber-node');
    
    nodes.forEach((node, index) => {
        const speed = (index + 1) * 0.3;
        node.style.transform = `translateY(${scrolled * speed}px) scale(${1 + scrolled * 0.0001})`;
    });
});

function addGlitchEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Glitch effect every 5 seconds
    setInterval(() => {
        heroTitle.style.textShadow = `
            2px 0 #ff0080,
            -2px 0 #00ffff,
            0 0 10px rgba(0,255,255,0.5)
        `;
        heroTitle.style.animation = 'glitchBlink 0.3s ease';
        
        setTimeout(() => {
            heroTitle.style.textShadow = 'none';
            heroTitle.style.animation = '';
        }, 300);
    }, 5000);
}

addGlitchEffect();