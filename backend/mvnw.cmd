@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV Vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV Vars
@REM MAVEN_BATCH_ECHO - to turn on echoing of the commands
@REM MAVEN_BATCH_PAUSE - to pause the script at the end
@REM MAVEN_OPTS - parameters to passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@REM set %ENABLE_DELAYED_EXPANSION% to on if possible
IF "%OS%"=="Windows_NT" SETLOCAL ENABLEDELAYEDEXPANSION

@REM Execute a user defined script before this one
IF NOT "%MAVEN_SKIP_RC%" == "" GOTO skipRcPre
@REM Check for pre script
IF EXIST "%USERPROFILE%\.mavenrc_pre.bat" call "%USERPROFILE%\.mavenrc_pre.bat"
@REM check for script in repository
IF EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\jvm.config" (
    FOR /F "usebackq tokens=*" %%G IN ("%MAVEN_PROJECTBASEDIR%\.mvn\jvm.config") DO (
        SET JVM_CONFIG_MAVEN_PROPS=!JVM_CONFIG_MAVEN_PROPS! %%G
    )
)
:skipRcPre

@REM To isolate internal variables from possible post scripts, we use another setlocal
@IF "%OS%"=="Windows_NT" SETLOCAL

@REM ==== START VALIDATION ====
IF NOT "%JAVA_HOME%" == "" GOTO OkJHome
FOR %%i IN (java.exe) DO SET JAVA_EXE=%%~$PATH:i
IF NOT "%JAVA_EXE%" == "" GOTO OkJHome

ECHO.
ECHO Error: JAVA_HOME not found in your environment. >&2
ECHO Please set the JAVA_HOME variable in your environment to match the >&2
ECHO location of your Java installation. >&2
ECHO.
GOTO error

:OkJHome
IF NOT "%MAVEN_PROJECTBASEDIR%" == "" GOTO endDetectBaseDir
SET "EXEC_DIR=%CD%"
SET "WDIR=%EXEC_DIR%"
:findBaseDir
IF EXIST "%WDIR%"\.mvn SET "MAVEN_PROJECTBASEDIR=%WDIR%" & GOTO endDetectBaseDir
CD ..
IF "%WDIR%"=="%CD%" GOTO baseDirNotFound
SET "WDIR=%CD%"
GOTO findBaseDir

:baseDirNotFound
SET "MAVEN_PROJECTBASEDIR=%EXEC_DIR%"
CD "%EXEC_DIR%"

:endDetectBaseDir

SET "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
SET "WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

mvn %*
IF ERRORLEVEL 1 GOTO error
GOTO end

:error
exit /B 1

:end
exit /B 0
