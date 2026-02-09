#!/bin/sh

printf 'Content-type: application/json\r\n\r\n'

total=0
count=0
CDROMS=`cat /etc/sysconfig/cdroms 2>/dev/null | grep -o sr[[:digit:]]`
VALIDCDS=''
for CD in $CDROMS; do
    [ -d "/mnt/${CD}" ] && mount "/mnt/${CD}" 2>/dev/null
    total=$(expr $total + 1)
    KERNEL_FOUND=false
    ROOTFS_FOUND=false
    if [ -d /mnt/"$CD"/boot ]; then
    [ -r /mnt/"$CD"/boot/vmlinuz ] &&  KERNEL_FOUND=true
    [ -r /mnt/"$CD"/boot/core.gz ] && ROOTFS_FOUND=true
    [ -r /mnt/"$CD"/boot/vmlinuz64 ] && KERNEL_FOUND=true
    [ -r /mnt/"$CD"/boot/corepure64.gz ] && ROOTFS_FOUND=true
    ( $KERNEL_FOUND ) || MISSING=$(printf '\nmissing vmlinuz/vmlinuz64 in %s\n' "$CD")
    ( $ROOTFS_FOUND ) || MISSING=$(printf '%s\nmissing core.gz/corepure64.gz in %s\n' "$MISSING" "$CD")
    ( $KERNEL_FOUND ) && ( $ROOTFS_FOUND ) && VALIDCDS="$VALIDCDS $CD"
    else
        count=`expr $count + 1`
    fi
done
[ "$total" -eq "$count" ] && MISSING="missing boot directory."

if [ -z "$VALIDCDS" ]
then
    if [ -n "$MISSING" ]
    then
        echo '{"error": 1, "detail": "'$MISSING'"}'
    else
        echo '{"error": 2}'
    fi
    exit 0
fi

printf '{"cds": ['
first=1
for cd in $VALIDCDS
do
    [ $first -eq 1 ] && printf ', '
    printf '"%s"' $cd
    first=0
done
echo '}'