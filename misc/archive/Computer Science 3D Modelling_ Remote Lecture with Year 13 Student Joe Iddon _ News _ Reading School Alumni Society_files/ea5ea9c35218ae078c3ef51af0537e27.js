$(function() {
    (function($, config) {
        if ( ! config.user_is_admin) {
            return;
        }
        
        var COOKIE_DELIMITER = '|';

        var ALERT_SHOWN = false;
        var CANCEL_PRESSED = false;
        var OK_PRESSED = false;
        var name = '_idleSecondsCounter-' + config.admin_user_hash;
        resetCookie();

        var $alert;

        $(document).on('keypress click mousemove touchmove', function() {
            if ( ! ALERT_SHOWN) {
                resetCookie();
            }
        });

        var CheckIdleTime_timer = window.setInterval(CheckIdleTime, 1000);

        function CheckIdleTime() {
            var cookie = getCookie(name);
            if (typeof cookie === 'undefined') {
                resetCookie();
                return;
            }
            
            var cookieParts = cookie.split(COOKIE_DELIMITER);
            var lastActiveTime = cookieParts[0];
            var idleTimeInSeconds = Math.floor((Date.now() - lastActiveTime) / 1000);
            var cancelPressedCookie = cookieParts[2];
            var okPressedCookie = cookieParts[3];

            // Check if it is time to show the alert
            if (idleTimeInSeconds >= config.admin_timeout_period - config.reminder_period && ! ALERT_SHOWN) {
                showAlert();
                ALERT_SHOWN = true;
                CANCEL_PRESSED = false;
                OK_PRESSED = false;
                setCookie(name, lastActiveTime + COOKIE_DELIMITER + ALERT_SHOWN + COOKIE_DELIMITER + CANCEL_PRESSED + COOKIE_DELIMITER + OK_PRESSED, 0.5);
            }

            // Check if we have to close alert automatically
            if (ALERT_SHOWN && cancelPressedCookie === 'true') {
                hideAlert();
                ALERT_SHOWN = false;
            }

            // Check if we have to log out automatically
            if (idleTimeInSeconds >= config.admin_timeout_period || okPressedCookie === 'true') {
                hideAlert();
                clearInterval(CheckIdleTime_timer);
                window.location = BASE_URI + 'flat/adminTimeoutConfirmation';
            }

            if (ALERT_SHOWN) {
                $('.admin-timeout-alert-countdown', $alert).text(secondsToHms(config.admin_timeout_period - idleTimeInSeconds));
            }
        }

        function showAlert() {
            $alert = $('#admin-timeout-alert');
            if ($alert.length === 0) {
                var el = document.createElement("div");
                el.setAttribute("style","position:fixed;top:15%;left:35%;width:450px;\n" +
                    "    background-color: #ffffff;\n" +
                    "    border: 1px solid #999999;\n" +
                    "    border: 1px solid rgba(0, 0, 0, 0.2);\n" +
                    "    border-radius: 6px;\n" +
                    "    -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n" +
                    "    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n" +
                    "    background-clip: padding-box;\n" +
                    "    outline: none;" +
                    "    z-index: 10000;");
                el.setAttribute('class', 'alert');
                el.setAttribute('id', 'admin-timeout-alert');
                el.setAttribute('role', 'alert');
                el.innerHTML = '<button type="button" class="close" id="alert-container-close">&times;</button>\n' +
                    '           <div style="padding: 5px;">\n' +
                    '               <div id="inner-message" class="alert-error" style="margin: 0 auto;padding:10px 5px;font-size:14px">\n' +
                    'You will be logged out of the site in <span class="admin-timeout-alert-countdown">' + secondsToHms(config.reminder_period) + '</span> due to inactivity, would you like to stay logged in?' +
                    '               </div>\n' +
                    '           </div>\n' +
                    '           <div style="padding: 5px;text-align: center">\n' +
                    '               <button type="button" class="btn btn-primary" id="confirm-container-close" style="padding:5px 14px; margin-right:10px;">Yes</button>\n' +
                    '               <button type="button" class="btn btn-danger" id="confirm-container-logout" style="padding:5px 14px;">No</button>\n' +
                    '           </div>';
                document.body.appendChild(el);

                $alert = $(el);

                $('#alert-container-close', $alert).click(closeListener);
                $('#confirm-container-close', $alert).click(closeListener);
                $('#confirm-container-logout', $alert).click(function() {
                    hideAlert();
                    OK_PRESSED = true;
                    resetCookie();
                    clearInterval(CheckIdleTime_timer);
                    window.location = BASE_URI + 'flat/adminTimeoutConfirmation';
                });
            }

            $alert.show();
        }

        function resetCookie() {
            setCookie(name, Date.now() + COOKIE_DELIMITER + ALERT_SHOWN + COOKIE_DELIMITER + CANCEL_PRESSED + COOKIE_DELIMITER + OK_PRESSED, 0.5);
        }

        function pingPost() {
            $.post(SITE_URL + 'flat/pingTimeoutFunction');
        }

        // Runs every 5 minutes to keep connection to server active
        setInterval(function(){
            $.post(SITE_URL + 'flat/keepAlive/' + Date.now());
        }, 300000);

        function hideAlert() {
            $('#admin-timeout-alert').hide();
        }

        function closeListener() {
            CANCEL_PRESSED = true;
            OK_PRESSED = false;
            ALERT_SHOWN = false;
            hideAlert();
            pingPost();
            resetCookie();
        }
        
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        function secondsToHms(d) {
            d = Number(d);
            
            var showTimeoutPeriodMinutes = Math.floor(config.admin_timeout_period / 60);
            var showTimeoutPeriod = showTimeoutPeriodMinutes > 0 && Math.floor(d / 60) === showTimeoutPeriodMinutes;
            if (showTimeoutPeriod) {
                d = config.admin_timeout_period;
            }
            
            var h = Math.floor(d / 3600);
            var m = showTimeoutPeriod ? Math.floor(d % 3600 / 60) : Math.ceil(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            
            if ( ! showTimeoutPeriod && m === 1 && s !== 0 && s <= 45) {
                m = 0;
            }

            var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

            var result = hDisplay + mDisplay;
            if (showTimeoutPeriod) {
                result += sDisplay;
            } else {
                if (result === '') {
                    result = sDisplay;
                }
            }

            return result;
        }
    })($, adminTimeoutConfig);
});
