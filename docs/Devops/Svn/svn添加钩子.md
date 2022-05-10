---
tags: 学习/运维技术/版本管理/svn
---

添加svn提交钩子，svn commit操作会自动触发jenkins任务，并发送钉钉通知

```shell
#!/bin/bash
set -x

export LC_ALL="en_US.UTF-8"
SVNLOOK_BIN="/usr/local/svn/bin/svnlook"
svn_path=${1}
svn_revision=${2}


# post send request jenkins dir
MUSIC_WORK_DIR="^resource_center/音频资源"
VIDEO_WORK_DIR="^resource_center/视频资源"
SPINE_WORK_DIR="^resource_center/Assets/spine_work"
FGUI_WORK_DIR="^frontend/Assets/fgui"



# ding_token
MUSIC_ding_token="59e5648d22598b6108f662ad52a178df571c5656959cc875dc1004b9c58b01fe"

# jenkins postcommit
MUSIC_jenkins_url="https://jenkins-ci.youle.game/view/pandora/job/pandora-hester/job/%E9%9F%B3%E9%A2%91%E8%B5%84%E6%BA%90%E5%AF%BC%E5%87%BA"
Video_jenkins_url="https://jenkins-ci.youle.game/view/pandora/job/pandora-hester/job/%E8%A7%86%E9%A2%91%E8%B5%84%E6%BA%90%E5%AF%BC%E5%87%BA"
Spine_jenkins_url="https://jenkins-ci.youle.game/view/pandora/job/pandora-hester/job/%E5%AF%BC%E5%87%BAspine"

fgui_jenkins_url="https://jenkins-ci.youle.game/view/pandora/job/pandora-hester/job/fgui_checkRequire"
dirs_changed=$($SVNLOOK_BIN dirs-changed -r ${svn_revision} ${svn_path})


function send_request() {
    jenkins_job_url=$1
    echo -e $jenkins_job_url
    curl -u "${JenkinsUser}:${JenkinsAccessToken}" -I "$jenkins_job_url/build?token=svn-post-commit-token"
}

function svn_changed_info()
{
    author="$($SVNLOOK_BIN author -r ${svn_revision} ${svn_path})"
    log="$($SVNLOOK_BIN log -r ${svn_revision} ${svn_path})"
    change_files="$($SVNLOOK_BIN changed -r ${svn_revision} ${svn_path})"
    commit_date="$($SVNLOOK_BIN date -r ${svn_revision} ${svn_path} | awk '{print $1, $2}')"
    content="作者:\t$author\n提交:\t$log\n变化:\n$change_files\n时间:\t$commit_date\n"
    echo "$content"
}

function dingding()
{
    content="$(svn_changed_info)"
    ding_token=${1}
    curl "https://oapi.dingtalk.com/robot/send?access_token=$ding_token" \
        -H 'Content-Type: application/json' \
        -d "
       {'msgtype': 'text',
         'text': {
             'content': \"$content\"
          }
       }"
}


function check_dirs_changed() {
    pattern=$1
    echo $dirs_changed | grep -q -E $pattern
    return $?
}


#if check_dirs_changed $MUSIC_WORK_DIR; then
#    dingding $MUSIC_ding_token
#fi
#
#if check_dirs_changed $VIDEO_WORK_DIR; then
#    dingding $MUSIC_ding_token
#fi
#
#if check_dirs_changed $SPINE_WORK_DIR; then
#    dingding $MUSIC_ding_token
#fi


if check_dirs_changed $SPINE_WORK_DIR ; then
    send_request $Spine_jenkins_url
fi


if check_dirs_changed $MUSIC_WORK_DIR ; then
    send_request $MUSIC_jenkins_url
fi

if check_dirs_changed $VIDEO_WORK_DIR ; then
    send_request $Video_jenkins_url
fi
if check_dirs_changed $FGUI_WORK_DIR ; then
    send_request $fgui_jenkins_url
fi

#if check_dirs_changed $FGUI_WORK_DIR; then
#    dingding $MUSIC_ding_token
#fi
```