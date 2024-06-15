export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export ANDROID_HOME=$HOME/Android/Sdk

pre-setup:
	(cd ansible && ansible-galaxy install -r requirements.yml)

setup: pre-setup
	(cd ansible && ansible-playbook setup.yml)

# **CLI capacitor per device**
# Android
cap-add-android:
	bunx cap add android

cap-build-android:
	bunx cap build android

cap-run-android:
	bunx cap run android --livereload-url=https://localhost:3000

cap-open-android:
	bunx cap open android
