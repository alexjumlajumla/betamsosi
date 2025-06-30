#!/bin/bash

# FCM Testing Script
# This script helps test FCM functionality from the command line

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="https://your-domain.com/api/v1"
LOG_FILE="fcm-test-$(date +%Y%m%d-%H%M%S).log"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to log output
log_output() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. JSON output will not be formatted."
        JQ_AVAILABLE=false
    else
        JQ_AVAILABLE=true
    fi
    
    print_success "Dependencies check completed"
}

# Function to get user input
get_user_input() {
    local prompt="$1"
    local default="$2"
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        echo "${input:-$default}"
    else
        read -p "$prompt: " input
        echo "$input"
    fi
}

# Function to make API request
make_api_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local token="$4"
    
    local url="$API_BASE_URL$endpoint"
    local headers=()
    
    if [ -n "$token" ]; then
        headers+=("-H" "Authorization: Bearer $token")
    fi
    
    if [ -n "$data" ]; then
        headers+=("-H" "Content-Type: application/json")
        headers+=("-d" "$data")
    fi
    
    local response
    if [ "$JQ_AVAILABLE" = true ]; then
        response=$(curl -s -X "$method" "$url" "${headers[@]}" | jq '.')
    else
        response=$(curl -s -X "$method" "$url" "${headers[@]}")
    fi
    
    echo "$response"
}

# Function to test system status
test_system_status() {
    print_status "Testing system FCM configuration..."
    
    local response
    response=$(make_api_request "GET" "/test/system-status" "" "$AUTH_TOKEN")
    
    if [ "$JQ_AVAILABLE" = true ]; then
        echo "$response" | jq '.'
    else
        echo "$response"
    fi
    
    log_output "System status test completed"
}

# Function to get token status
get_token_status() {
    print_status "Getting FCM token status..."
    
    local response
    response=$(make_api_request "GET" "/test/token-status" "" "$AUTH_TOKEN")
    
    if [ "$JQ_AVAILABLE" = true ]; then
        echo "$response" | jq '.'
    else
        echo "$response"
    fi
    
    log_output "Token status retrieved"
}

# Function to register test token
register_test_token() {
    local token="$1"
    
    if [ -z "$token" ]; then
        print_error "Token is required"
        return 1
    fi
    
    print_status "Registering test FCM token..."
    
    local data="{\"token\": \"$token\"}"
    local response
    response=$(make_api_request "POST" "/test/register-token" "$data" "$AUTH_TOKEN")
    
    if [ "$JQ_AVAILABLE" = true ]; then
        echo "$response" | jq '.'
    else
        echo "$response"
    fi
    
    log_output "Test token registration completed"
}

# Function to send test notification
send_test_notification() {
    local title="$1"
    local body="$2"
    
    print_status "Sending test notification..."
    
    local data="{\"title\": \"$title\", \"body\": \"$body\", \"data\": {\"type\": \"test\", \"timestamp\": $(date +%s)}}"
    local response
    response=$(make_api_request "POST" "/test/send-notification" "$data" "$AUTH_TOKEN")
    
    if [ "$JQ_AVAILABLE" = true ]; then
        echo "$response" | jq '.'
    else
        echo "$response"
    fi
    
    log_output "Test notification sent"
}

# Function to clear tokens
clear_tokens() {
    print_status "Clearing all FCM tokens..."
    
    local response
    response=$(make_api_request "POST" "/test/clear-tokens" "" "$AUTH_TOKEN")
    
    if [ "$JQ_AVAILABLE" = true ]; then
        echo "$response" | jq '.'
    else
        echo "$response"
    fi
    
    log_output "Tokens cleared"
}

# Function to run full test suite
run_full_test() {
    print_status "Running full FCM test suite..."
    
    # Test system status
    test_system_status
    echo
    
    # Get current token status
    get_token_status
    echo
    
    # Register a test token
    local test_token="test_fcm_token_$(date +%s)"
    register_test_token "$test_token"
    echo
    
    # Get updated token status
    get_token_status
    echo
    
    # Send test notification
    send_test_notification "Test Notification" "This is a test notification from CLI"
    echo
    
    # Clear tokens
    clear_tokens
    echo
    
    print_success "Full test suite completed"
}

# Function to show usage
show_usage() {
    echo "FCM Testing Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -u, --url URL           Set API base URL (default: $API_BASE_URL)"
    echo "  -t, --token TOKEN       Set authentication token"
    echo "  -f, --full              Run full test suite"
    echo "  -s, --system            Test system status"
    echo "  -g, --get-status        Get token status"
    echo "  -r, --register TOKEN    Register test token"
    echo "  -n, --notify            Send test notification"
    echo "  -c, --clear             Clear all tokens"
    echo ""
    echo "Examples:"
    echo "  $0 --full"
    echo "  $0 --system"
    echo "  $0 --register 'test_fcm_token_123'"
    echo "  $0 --notify"
}

# Main script
main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -u|--url)
                API_BASE_URL="$2"
                shift 2
                ;;
            -t|--token)
                AUTH_TOKEN="$2"
                shift 2
                ;;
            -f|--full)
                RUN_FULL_TEST=true
                shift
                ;;
            -s|--system)
                TEST_SYSTEM=true
                shift
                ;;
            -g|--get-status)
                GET_STATUS=true
                shift
                ;;
            -r|--register)
                REGISTER_TOKEN="$2"
                shift 2
                ;;
            -n|--notify)
                SEND_NOTIFICATION=true
                shift
                ;;
            -c|--clear)
                CLEAR_TOKENS=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Check dependencies
    check_dependencies
    
    # Get authentication token if not provided
    if [ -z "$AUTH_TOKEN" ]; then
        AUTH_TOKEN=$(get_user_input "Enter authentication token")
    fi
    
    # Update API base URL if not provided
    if [ "$API_BASE_URL" = "https://your-domain.com/api/v1" ]; then
        API_BASE_URL=$(get_user_input "Enter API base URL" "https://your-domain.com/api/v1")
    fi
    
    print_status "Starting FCM tests..."
    print_status "API Base URL: $API_BASE_URL"
    print_status "Log file: $LOG_FILE"
    
    # Run requested tests
    if [ "$RUN_FULL_TEST" = true ]; then
        run_full_test
    else
        if [ "$TEST_SYSTEM" = true ]; then
            test_system_status
        fi
        
        if [ "$GET_STATUS" = true ]; then
            get_token_status
        fi
        
        if [ -n "$REGISTER_TOKEN" ]; then
            register_test_token "$REGISTER_TOKEN"
        fi
        
        if [ "$SEND_NOTIFICATION" = true ]; then
            local title=$(get_user_input "Enter notification title" "Test Notification")
            local body=$(get_user_input "Enter notification body" "This is a test notification")
            send_test_notification "$title" "$body"
        fi
        
        if [ "$CLEAR_TOKENS" = true ]; then
            clear_tokens
        fi
    fi
    
    print_success "FCM testing completed. Check log file: $LOG_FILE"
}

# Run main function with all arguments
main "$@" 