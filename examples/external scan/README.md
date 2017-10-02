This sample project shows how to scan an image produced as part of a build process.  In
this case the build process produces an image and the static image is scanned.  This is
a bit less thorough than scanning a running container since insights cannot check for
things like open ports.

gulp build
gulp test
 