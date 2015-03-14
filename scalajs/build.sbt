enablePlugins(ScalaJSPlugin)

scalaVersion := "2.11.5"

name := "chess"

libraryDependencies += "com.lihaoyi" %%% "utest" % "0.3.0" % "test"
libraryDependencies += "be.doeraene" %%% "scalajs-jquery" % "0.8.0"

jsDependencies += RuntimeDOM

skip in packageJSDependencies := false

testFrameworks += new TestFramework("utest.runner.Framework")

persistLauncher in Compile := true
persistLauncher in Test := false
