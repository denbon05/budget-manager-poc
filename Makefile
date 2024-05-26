pre-setup:
	(cd ansible && ansible-galaxy install  -rrequirements.yml)

setup: pre-setup
	(cd ansible && ansible-playbook setup.yml)

# **CLI capacitor per device**
# Android
cap-run-android:
	ANDROID_SDK_ROOT=$HOME/Android/Sdk \
	bunx cap run android --livereload-url=https://localhost:3000

cap-open-android:
	ANDROID_SDK_ROOT=$HOME/Android/Sdk \
	CAPACITOR_ANDROID_STUDIO_PATH=/opt/android-studio/bin/studio.sh \
	bunx cap open android