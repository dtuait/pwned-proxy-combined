from django.db import migrations, models


def remove_null_group_keys(apps, schema_editor):
    APIKey = apps.get_model('api', 'APIKey')
    APIKey.objects.filter(group__isnull=True).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_endpointlog'),
    ]

    operations = [
        migrations.RunPython(remove_null_group_keys, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='apikey',
            name='group',
            field=models.ForeignKey(on_delete=models.CASCADE, related_name='api_keys', to='auth.group'),
        ),
    ]
